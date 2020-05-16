import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import MyPlugin from '@/plugins/my-plugin'
import vuetify from '@/plugins/vuetify'


Vue.config.productionTip = false
Vue.use(MyPlugin);

const files = require.context("./", true, /\.vue$/i);
files.keys().map(key =>
  Vue.component(
    key
    .split("/")
    .pop()
    .split(".")[0],
    files(key).default
  )
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')