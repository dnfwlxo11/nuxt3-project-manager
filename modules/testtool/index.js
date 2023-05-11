import { defineNuxtModule } from '@nuxt/kit'
import fs from 'fs'
import path from 'path'
import http from 'http'
import socket from 'socket.io'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineNuxtModule({
  meta: {
    name: 'daein-testtool',
    configKey: 'testtool',
  },

  setup(options, nuxt) {
    const server = http.createServer()

    server.listen(process.env.SOCKET_PORT, () => {
      console.log(`Server started, ${process.env.SOCKET_PORT} ${process.env.SOCKET_HOST}`)
    })

    const io = socket(server, {
      cors: {
        origin: '*',
      }
    })

    const allComponent = []
    const allImports = []
    const componentNames = []
    const componentsTree = {}
    const importsTree = {}
    const utilsTree = []
    const extendImports = []
    const fileChanges = []

    function fileAnalyzer(filePath, type, root=true) {
      if (type === 'component') {
        const content = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })

        const templateCode = content.match(/<template((.|\n)*)\/template>/g)
        const scriptCode = content.match(/<script((.|\n)*)\/script>/g)
        const styleCode = content.match(/<style((.|\n)*)\/style>/g)
        const tags = content.match(/(<\/[\s+]?\w+[\s+]?>)|(<[\s+]?.*[\s+]?\/>)/g)

        const relativeCode = tags.reduce((acc, tag) => {
          const pureTag = tag.split(' ')[0].replace(/<|>|\/|-|_/g, '').toLowerCase()
          
          if (componentNames.includes(pureTag)) {
            const tagInfor = allComponent[componentNames.indexOf(pureTag)]
            const addedData = {
              tagName: tagInfor.pascalName,
            }

            const baseFileName = filePath.replace(process.env.PWD, '').replace('.vue', '').toLowerCase().split('/').slice(2).join('')
            if (baseFileName !== pureTag) {
              const { relativeCode: nestedRelative } = fileAnalyzer(tagInfor.filePath, type='component')
              
              if (nestedRelative.length) addedData['related'] = nestedRelative
            }

            acc.push(addedData)
          }

          return acc
        }, [])

        const result = {
          templateCode,
          scriptCode,
          styleCode,
          relativeCode
        }

        return result
      } else if (type === 'other') {
        console.log('other type')

        return false
      } else {
        console.log('분석이 불가능한 파일입니다.')
        return false
      }
    }

    function extractPathToObject(targetPath, rootPath='') {
      const files = {}

      if (!fs.existsSync(targetPath)) return

      const stat = fs.lstatSync(targetPath)
      const rootName = targetPath.split('/').pop()
      rootPath ? rootPath = rootPath : rootPath = rootName

      if (!files[rootName]) files[rootName] = { item: [], child: [] }

      if (stat.isDirectory()) {
        fs.readdirSync(targetPath).forEach(name => {
          const stat = fs.lstatSync(path.join(targetPath, name))
          const filePath = path.join(targetPath, name)
          const fileName = name.split('.')[0]

          if (stat.isDirectory()) {
            files[rootName]['child'].push(extractPathToObject(filePath, path.join(rootPath, fileName)))
          } else {
            files[rootName]['item'].push({ name, projectPath: path.join(rootPath, fileName) })

            fs.watchFile(filePath, (curr, prev) => {
              const updateFile = { name, path: filePath, curr, prev }

              io.emit('update:file', updateFile)
            })
          }
        })
      } else {
        files[rootName]['item'].push({ name: rootName, path: path.join(rootPath, fileName) })
      }

      if (!files[rootName]['item'].length) delete files[rootName]['item']
      if (!files[rootName]['child'].length) delete files[rootName]['child']
    
      return files
    }
    
    function createPathObject(shortPath, projectPath, filePath, baseObj, root=true) {
      const isFileReg = new RegExp(/\.\w\S+/g)

      const pathArr = shortPath.split('/')
      const currName = pathArr.shift()

      if (isFileReg.test(currName)) {
        if (!baseObj.item.filter(item => item.name === currName).length) {
          baseObj.item.push({
            name: currName,
            projectPath,
            filePath
          })
        }
      } else {
        if (root) {
          if (!Object.keys(baseObj).filter(item => item === currName).length) baseObj[currName] = { item: [], child: [] }
          
          createPathObject(pathArr.join('/'), projectPath, filePath, baseObj[currName], false)
        } else {
          if (root) {
            if (baseObj[currName].child.filter(item => Object.keys(item)[0] === currName).length) return 
          } else {
            if (!baseObj.child.filter(item => Object.keys(item)[0] === currName).length) {
              baseObj.child.push({
                [currName]: { item: [], child: [] }
              })
            }
          }

          createPathObject(pathArr.join('/'), projectPath, filePath, baseObj.child.filter(item => Object.keys(item)[0] === currName)[0][currName], false)
        }
      }
    }

    nuxt.hook('pages:extend', (pages) => {
      pages.push({ 
        name: 'test-route',
        path: '/test/:path(.*)*',
        file: path.join(__dirname, 'pages/index.vue'),
        children: [],
      })

      pages.push({ 
        name: 'test-color-ystem',
        path: '/test/colorSystem',
        file: path.join(__dirname, 'pages/colorSystem.vue'),
        children: [],
      })
    })

    nuxt.hook('imports:extend', (imports) => {
      imports.forEach((item, idx) => {
        const shortPath = item.from.replace(`${process.env.PWD}/`, '')
        const importDirectory = shortPath.split('/')[0]

        fs.watch(path.join(process.env.PWD, importDirectory), (type, filename) => {
          io.emit('update:imports', { filename, type })
        })

        fs.watchFile(item.from, (curr, prev) => {
          const updateFile = { name: shortPath, path: item.from, curr, prev }

          io.emit('update:imports', updateFile)
        })

        createPathObject(shortPath, shortPath, item.from, importsTree)

        allImports.push({
          ...item,
          shortPath: shortPath,
          directory: importDirectory !== 'utils' ? 'composables' : importDirectory,
        })
      })
    })

    function updateTree(items) {
      const tmpObj = {}
      const tmpComponents = []
      items.map((item, idx) => {
        createPathObject(item.shortPath, item.shortPath, item.filePath, tmpObj)

        tmpComponents.push(item)
      })

      return {
        basePath: process.env.PWD,
        components: tmpComponents,
        tree: tmpObj,
      }
    }

    nuxt.hook('components:extend', (components) => {
      // fs.watch(path.join(process.env.PWD, 'components'), (type, filename) => {
      //   io.emit('components:extend', updateTree(components))
      //   io.emit('update:components', { filename, type })
      // })
      
      components.map((component, idx) => {
        fs.watchFile(component.filePath, (curr, prev) => {
          const updateFile = { name: component.shortPath.split('/').pop(), path: component.filePath, curr, prev }

          io.emit('components:extend', updateTree(components))
          io.emit('update:components', updateFile)
        })

        createPathObject(component.shortPath, component.shortPath, component.filePath, componentsTree)

        allComponent.push(component)
        componentNames.push(component.pascalName.toLowerCase())
      })
    })

    io.on('connection', (socket) => {
      io.emit('imports:extend', {
        basePath: process.env.PWD,
        imports: allImports,
        tree: importsTree
      })
      io.emit('components:extend', {
        basePath: process.env.PWD,
        components: allComponent,
        tree: componentsTree
      })
      io.emit('builder:watch', fileChanges)

      socket.on('load:file', (path) => {
        const isFileReg = new RegExp(/\.\w\S+/g)
        const extensions = path.match(isFileReg)

        if (extensions[0] === '.vue') {
          io.emit('load:file', fileAnalyzer(path, 'component'))
        } else if (extensions[0] === '.js') {
          io.emit('load:file', fileAnalyzer(path, 'other'))
        } else io.emit('load:file', fileAnalyzer(`${path}.vue`, 'component'))
      })
    })
  }
})