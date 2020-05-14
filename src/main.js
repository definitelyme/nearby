import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import MyPlugin from '@/plugins/my-plugin';
import vuetify from '@/plugins/vuetify';


Vue.config.productionTip = false
Vue.use(MyPlugin);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')