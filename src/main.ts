import Vue from 'vue'
import App from './App.vue'
import SideDisplay from './SideDisplay.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import utils from './utils'
import { ConfigManager } from './utils/ConfigManager'

Vue.config.productionTip = false
Vue.prototype.$utils = utils;

const second = window.process.argv[window.process.argv.length - 1] === '1'


import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

// Инициализируем конфиг менеджер
ConfigManager.getInstance().initialize().then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(second ? SideDisplay : App)
  }).$mount('#app')
}).catch(error => {
  console.error('Ошибка инициализации конфига:', error)
  // Запускаем приложение даже если конфиг не загрузился
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(second ? SideDisplay : App)
  }).$mount('#app')
})
