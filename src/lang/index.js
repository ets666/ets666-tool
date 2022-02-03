import { createI18n as CreateI18n } from 'vue-i18n'
import elementEnLocale from 'element-plus/es/locale/lang/en' // element-ui lang
import elementTrLocale from 'element-plus/es/locale/lang/tr' // element-ui lang
import elementZhSLocale from 'element-plus/es/locale/lang/zh-cn' // element-ui lang
import elementZhTLocale from 'element-plus/es/locale/lang/zh-tw' // element-ui lang
import enLocale from './en'
import trLocale from './tr-TR'
import zhSLocale from './zh-CN'
import zhTLocale from './zh-TW'

const language = navigator.language

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  tr: {
    ...trLocale,
    ...elementTrLocale
  },
  'zh-CN': {
    ...zhSLocale,
    ...elementZhSLocale
  },
  'zh-TW': {
    ...zhTLocale,
    ...elementZhTLocale
  },
  'zh-HK': {
    ...zhTLocale,
    ...elementZhTLocale
  },
  'zh-MO': {
    ...zhTLocale,
    ...elementZhTLocale
  },
  'zh-SG': {
    ...zhSLocale,
    ...elementZhSLocale
  }
}

const i18n = new CreateI18n({
  legacy: false,
  globalInjection: true,
  locale: language || 'en', // set locale
  messages // set locale messages
})

export default i18n
