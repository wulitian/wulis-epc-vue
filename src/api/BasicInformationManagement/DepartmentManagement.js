import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除部门信息(根据id)
 */
export const deleteDepartmentById = (data) => {
  return axios({
    url: '/web/bim/department/deleteDepartment',
    method: 'delete',
    data:data
  })
}
/**
 * 新增部门信息
 */
export const insertDepartment = (data) => {
  return axios({
    url: '/web/bim/department/insertDepartment',
    method: 'post',
    data:data
  })
}
/**
 * 查询部门信息(通过id)
 */
export const queryDepartmentByid = (data) => {
  return axios({
    url: '/web/bim/department/queryDepartment?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询机构信息列表（全量）
 */
export const queryOrganizationList = () => {
  return axios({
    url: '/web/bim/organization/queryOrganizationList',
    method: 'get',
  })
}
/**
 * 查询部门信息列表(树形)
 */
export const queryDepartmentTree = (data) => {
  return axios({
    url: '/web/bim/department/queryDepartmentTree?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询部门信息列表(树形：登录用户所属企业部门)
 */
export const queryUserDepartmentTree = () => {
  return axios({
    url: '/web/bim/department/queryUserDepartmentTree',
    method: 'get',
  })
}
/**
 * 修改部门信息
 */
export const updateDepartment = (data) => {
  return axios({
    url: '/web/bim/department/updateDepartment',
    data:data,
    method: 'put',
  })
}
