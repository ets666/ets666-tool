import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

const messages = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  legacy: false,
  globalInjection: true,
  messages,
})

export default i18n