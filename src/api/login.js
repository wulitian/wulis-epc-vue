import axios from '@/utils/request'
import qs from 'qs'

/**
 * 获取用户信息
 * @param menuId
 */
export const getUserInfo = () => {
  return axios({
    url: '/api/login',
    method: 'get',
  })
}

/**
 * 获取token
 * @param data
 */
export const getToken = (data) => {
  return axios({
    url: '/web/form/login?'+qs.stringify(data),
    method: 'get',
  })
}

/**
 * 获取菜单
 */
export const getNav = () => {
  return axios({
    url: '/web/queryMenuList',
    method: 'get',
  })
}

/**
 * 注销登录
 */
export function logout () {
  return axios({
    url: '/web/logout',
    method: 'get',
  })
}


