import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除角色
 */
export const deleteRoleByid = (data) => {
  return axios({
    url: '/web/permission/role/deleteRole',
    method: 'delete',
    data:data
  })
}
/**
 * 新增角色
 */
export const insertRole = (data) => {
  return axios({
    url: '/web/permission/role/insertRole',
    method: 'post',
    data:data
  })
}
/**
 * 查询角色(通过id)
 */
export const queryRoleByid = (data) => {
  return axios({
    url: '/web/permission/role/queryRole?'+qs.stringify(data),
    method: 'post',
  })
}
/**
 * 查询角色列表（全量）
 */
export const queryRoleList = () => {
  return axios({
    url: '/web/permission/role/queryRoleList',
    method: 'get',
  })
}
/**
 * 查询角色列表(分页)
 */
export const queryRolePage = (data) => {
  return axios({
    url: '/web/permission/role/queryRolePage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改角色
 */
export const updateRole = (data) => {
  return axios({
    url: '/web/permission/role/updateRole',
    data:data,
    method: 'put',
  })
}
