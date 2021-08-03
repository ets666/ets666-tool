import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementTrLocale from 'element-ui/lib/locale/lang/tr-TR' // element-ui lang
import elementZhSLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementZhTLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import enLocale from './en'
import trLocale from './tr-TR'
import zhSLocale from './zh-CN'
import zhTLocale from './zh-TW'

Vue.use(VueI18n)
let language = navigator.language

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  'tr': {
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

const i18n = new VueI18n({
  locale: language || 'en', // set locale
  messages // set locale messages
})

export default i18n
