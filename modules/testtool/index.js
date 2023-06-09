import { defineNuxtModule } from '@nuxt/kit'
import fs from 'fs'
import path from 'path'
import http from 'http'
import socket from 'socket.io'
import deepmerge from 'deepmerge'
import merge from 'lodash/merge'
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
    const extendComponents = []
    const importsArr = []
    const fileChanges = []

    function fileAnalyzer(path) {
      const content = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })

      const templateCode = content.match(/<template((.|\n)*)\/template>/g)
      const scriptCode = content.match(/<script((.|\n)*)\/script>/g)
      const styleCode = content.match(/<style((.|\n)*)\/style>/g)
      const tags = content.match(/(<\/[\s+]?\w+[\s+]?>)|(<[\s+]?.*[\s+]?\/>)/g)

      const relativeCode = tags.reduce((acc, tag) => {
        const pureTag = tag.split(' ')[0].replace(/<|>|\/|-|_/g, '').toLowerCase()
        if (allComponent.includes(pureTag)) {
          const tagInfor = allComponent[allComponent.indexOf(pureTag)]
          console.log(allComponent.indexOf(pureTag))
          console.log(extendComponents)
          console.log(tagInfor, 'tagInfor')
          const addedData = {
            tagName: tagInfor.pascalName,
          }

          const baseFileName = path.replace(process.env.PWD, '').replace('.vue', '').toLowerCase().split('/').slice(2).join('')
          if (baseFileName !== pureTag) {
            const { relativeCode: nestedRelative } = fileAnalyzer(tagInfor.filePath)
            
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
      const pathArr = shortPath.split('/')
      const currName = pathArr.shift()

      const isFileReg = '^\s*[\p{L}\p{N}\p{Pd}\p{Zs}]+\s*(?:[\p{L}\p{N}\p{Pd}\p{Zs}]+\s*)*(?:\.[\p{L}\p{N}\p{Pd}\p{Zs}]+)?\s*$'

      if (currName.includes('.vue')) {
        baseObj.item.push({
          name: currName,
          projectPath,
          filePath
        })
      } else {
        if (root) {
          if (!Object.keys(baseObj).length) baseObj[currName] = { item: [], child: [] }
          
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

      return baseObj
    }


    nuxt.hook('imports:extend', (imports) => {
      imports.forEach((item, idx) => {
        const importDirectory = item.from.replace(`${process.env.PWD}/`, '').split('/')[0]

        importsArr.push({
          ...item,
          shortPath: item.from.replace(`${process.env.PWD}/`, ''),
          directory: importDirectory !== 'utils' ? 'composables' : importDirectory,
        })
      })
    })

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

    nuxt.hook('components:extend', (components) => {
      fs.watch(path.join(process.env.PWD, 'components'), (type, filename) => {
        io.emit('update:file', { filename, type })
      })
      
      let baseObj = {}
      components.map((component, idx) => {
        const result = createPathObject(component.shortPath, component.shortPath.split('.')[0], component.filePath, baseObj)
        baseObj = result

        console.log(component.pascalName)
        allComponent.push(component)
      })

      extendComponents.push(baseObj)
    })

    io.on('connection', (socket) => {
      io.emit('imports:extend', importsArr)
      io.emit('components:extend', {
        basePath: process.env.PWD,
        components: extendComponents,
      })
      io.emit('builder:watch', fileChanges)

      socket.on('load:file', (path) => {
        io.emit('load:file', fileAnalyzer(path))
      })
    })
  }
})