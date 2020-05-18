import Vue from 'vue'
import router from './router'
import store from './store'
const defaultRoutePath = '/main/workplace'
const whiteList = ['Login']
import { ACCESS_TOKEN } from '@/store/mutation-types'
router.beforeEach((to, from, next) => {
  if (Vue.ls.get(ACCESS_TOKEN)!=null) {
    if (to.path === '/login') {
      next({ path: defaultRoutePath })
    }else{
      if (store.getters.routeState) {
        store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(store.getters.addRouters)
          // 请求带有 redirect 重定向时，登录自动重定向到该地址
          const redirect = decodeURIComponent(from.query.redirect || to.path)
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        })
      } else {
        next()
      }
    }
  }else{
    console.log(to.name)
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

})

router.afterEach((to, from) => {
})
