import axios from '@/utils/request'
import qs from 'qs'

/**
 * 查询用户列表
 */
export const selectUserList = (data) => {
  return axios({
    url: '/web/personnel/user/info/queryUserPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询角色列表
 */
export const selectRoleList = () => {
  return axios({
    url: '/web/permission/role/queryAccountRoleList',
    method: 'get',
  })
}
/**
 * 添加用户
 */
export const addUser = (data) => {
  return axios({
    url: '/web/personnel/user/info/insertUser',
    method: 'post',
    data:data
  })
}
/**
 * 删除用户
 */
export const deleteUser = (data) => {
  return axios({
    url: '/web/personnel/user/info/deleteUser',
    method: 'delete',
    data:data
  })
}
