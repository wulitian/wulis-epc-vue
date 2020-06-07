import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除用户(通过id)
 */
export const deleteUserById = (data) => {
  return axios({
    url: '/web/bim/user/info/deleteUser',
    method: 'delete',
    data:data
  })
}
/**
 * 新增用户
 */
export const insertUser = (data) => {
  return axios({
    url: '/web/bim/user/info/insertUser',
    method: 'post',
    data:data
  })
}
/**
 * 查询用户（通过id）
 */
export const queryUserByid = (data) => {
  return axios({
    url: '/web/bim/user/info/queryUser?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询用户列表(根据部门id)
 */
export const queryUserListByOfficeId = (data) => {
  return axios({
    url: '/web/bim/user/info/queryUserList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询用户列表(分页)
 */
export const queryUserPage = (data) => {
  return axios({
    url: '/web/bim/user/info/queryUserPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改用户
 */
export const updateUser = (data) => {
  return axios({
    url: '/web/bim/user/info/updateUser',
    method: 'put',
    data:data
  })
}

