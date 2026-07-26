import { createI18n } from 'vue-i18n'
import elementEnLocale from 'element-plus/es/locale/lang/en' // element-ui lang
import elementTrLocale from 'element-plus/es/locale/lang/tr' // element-ui lang
import elementZhSLocale from 'element-plus/es/locale/lang/zh-cn' // element-ui lang
import elementZhTLocale from 'element-plus/es/locale/lang/zh-tw' // element-ui lang
import elementEsLocale from 'element-plus/es/locale/lang/es' // element-ui lang
import elementItLocale from 'element-plus/es/locale/lang/it' // element-ui lang
import elementJaLocale from 'element-plus/es/locale/lang/ja' // element-ui lang
import elementKoLocale from 'element-plus/es/locale/lang/ko' // element-ui lang
import elementDeLocale from 'element-plus/es/locale/lang/de' // element-ui lang
import elementPlLocale from 'element-plus/es/locale/lang/pl' // element-ui lang
import elementRuLocale from 'element-plus/es/locale/lang/ru' // element-ui lang

import enLocale from './locales/en'
import trLocale from './locales/tr-TR'
import zhSLocale from './locales/zh-CN'
import zhTLocale from './locales/zh-TW'
import esLocale from './locales/es'
import itLocale from './locales/it'
import jaLocale from './locales/ja'
import koLocale from './locales/ko'
import deLocale from './locales/de'
import plLocale from './locales/pl'
import ruLocale from './locales/ru'



const language = navigator.language

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
  es: {
    ...esLocale,
    ...elementEsLocale
  },
  'it-IT': {
    ...itLocale,
    ...elementItLocale
  },
  it: {
    ...itLocale,
    ...elementItLocale
  },
  'ja-JP': {
    ...jaLocale,
    ...elementJaLocale
  },
  ja: {
    ...jaLocale,
    ...elementJaLocale
  },
  'ko-KR': {
    ...koLocale,
    ...elementKoLocale
  },
  ko: {
    ...koLocale,
    ...elementKoLocale
  },
  'de-DE': {
    ...deLocale,
    ...elementDeLocale
  },
  de: {
    ...deLocale,
    ...elementDeLocale
  },
  'pl-PL': {
    ...plLocale,
    ...elementPlLocale
  },
  pl: {
    ...plLocale,
    ...elementPlLocale
  },
  'ru-RU': {
    ...ruLocale,
    ...elementRuLocale
  },
  ru: {
    ...ruLocale,
    ...elementRuLocale
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

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  globalInjection: true,
  locale: language || 'en',
  // locale: 'en',
  messages
})

export default i18n
