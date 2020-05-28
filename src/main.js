// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import './utils/request'
// import './mock/'
import store from './store/'
import './core/lazy_use'
import './permission'
import { Icon } from 'ant-design-vue'
import iconFront from './utils/iconfont.js'
const myicon = Icon.createFromIconfontCN({
  scriptUrl: iconFront
})
Vue.component('my-icon', myicon)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
