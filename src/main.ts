import Vue from 'vue'
import App from './App.vue'
import SideDisplay from './SideDisplay.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import utils from './utils'

Vue.config.productionTip = false 
Vue.prototype.$utils = utils;

const second = window.location.search === '?true'


import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(second ? SideDisplay : App)
}).$mount('#app')
