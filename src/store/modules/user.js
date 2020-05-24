import Vue from 'vue'
import { getToken , getUserInfo ,logout} from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    username: "",
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },
  actions: {
    // 登录
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getToken(data)
          .then(res => {
            Vue.ls.set(ACCESS_TOKEN, res.data, 60 * 60 * 1000)
            commit('SET_TOKEN', res.data)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          commit('SET_USERNAME', res.data.username)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROUTESTATE', true)
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
