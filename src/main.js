import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style/reset.css'
import http from '@/utils/http'

Vue.prototype.$http = http

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
