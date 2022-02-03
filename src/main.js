import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './style/reset.css'
import i18n from './lang'
import axios from 'axios'

createApp(App).use(router).use(ElementPlus, { size: 'small' }).use(i18n).provide('$http', axios).mount('#app')
