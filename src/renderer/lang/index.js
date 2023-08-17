import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es' // element-ui lang
import elementItLocale from 'element-ui/lib/locale/lang/it' // element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja' // element-ui lang
import elementKoLocale from 'element-ui/lib/locale/lang/ko' // element-ui lang
import elementTrLocale from 'element-ui/lib/locale/lang/tr-TR' // element-ui lang
import elementZhSLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementZhTLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import enLocale from './en'
import esLocale from './es'
import itLocale from './it'
import jaLocale from './ja'
import koLocale from './ko'
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
  'es-419': {
    ...esLocale,
    ...elementEsLocale
  },
  'es-ES': {
    ...esLocale,
    ...elementEsLocale
  },
  'es': {
    ...esLocale,
    ...elementEsLocale
  },
  'it-IT': {
    ...itLocale,
    ...elementItLocale
  },
  'it': {
    ...itLocale,
    ...elementItLocale
  },
  'ja-JP': {
    ...jaLocale,
    ...elementJaLocale
  },
  'ja': {
    ...jaLocale,
    ...elementJaLocale
  },
  'ko-KR': {
    ...koLocale,
    ...elementKoLocale
  },
  'ko': {
    ...koLocale,
    ...elementKoLocale
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
