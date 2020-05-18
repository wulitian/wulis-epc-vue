import { asyncRouterMap, baseRouterMap } from '@/config/baseRouterSettings'
import {getUserInfo,getNav} from "@/api/login";
import {generatorDynamicRouter} from "@/router/generator-routers";

const permission = {
  state: {
    routeState: true,
    routers: baseRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = baseRouterMap.concat(routers)
    },
    SET_ROUTESTATE: (state, info) => {
      state.routeState = info
    }
  },
  actions: {
    GenerateRoutes ({ commit }) {
      return new Promise((resolve,reject)=> {
        // 前段静态配置
        // commit('SET_ROUTERS', asyncRouterMap)
        // commit('SET_ROUTESTATE', false)
        // resolve()
        // 后台接口获取
        generatorDynamicRouter().then(res => {
          commit('SET_ROUTERS', res)
          commit('SET_ROUTESTATE', false)
          resolve()
        })
      })
    }
  }
}

export default permission
