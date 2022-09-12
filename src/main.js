import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin, LayoutPlugin, ModalPlugin } from 'bootstrap-vue'

// Custom CSS
import './assets/css/app.css'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'

Vue.config.productionTip = false
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// This imports all the layout components such as <b-container>, <b-row>, <b-col>:
Vue.use(LayoutPlugin)
// This imports <b-modal> as well as the v-b-modal directive as a plugin:
Vue.use(ModalPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
