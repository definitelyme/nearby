import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import MyPlugin from './foundation/my-plugin';
import './foundation/vuetify';

Vue.config.productionTip = false
Vue.use(MyPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')