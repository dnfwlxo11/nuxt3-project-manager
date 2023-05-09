import light from '@/theme/light'
import dark from '@/theme/dark'
import blue from '@/theme/blue'
import basic from '@/theme/basic'

const themes = {
  light,
  dark,
  blue,
}

export const defineBasic = () => {
  return basic
}

export const defineThemes = () => {
  return themes
}

export const defineTheme = (theme = 'light') => {
  return {
    theme,
    current: themes[theme] || {}
  }
}