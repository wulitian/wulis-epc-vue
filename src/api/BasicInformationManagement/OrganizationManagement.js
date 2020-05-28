import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除机构信息(通过id)
 */
export const deleteOrganizationByid = (data) => {
  return axios({
    url: '/web/basic/organization/deleteOrganization',
    method: 'delete',
    data:data
  })
}
/**
 * 新增机构信息
 */
export const insertOrganization = (data) => {
  return axios({
    url: '/web/basic/organization/insertOrganization',
    method: 'post',
    data:data
  })
}
/**
 * 查询机构信息(通过id)
 */
export const queryOrganizationByid = (data) => {
  return axios({
    url: '/web/basic/organization/queryOrganization?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询机构信息列表（全量）
 */
export const queryOrganizationList = () => {
  return axios({
    url: '/web/basic/organization/queryOrganizationList',
    method: 'get',
  })
}
/**
 * 查询机构信息列表（分页）
 */
export const queryOrganizationPage = (data) => {
  return axios({
    url: '/web/basic/organization/queryOrganizationPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改机构信息
 */
export const updateOrganization = (data) => {
  console.log(data)
  return axios({
    url: '/web/basic/organization/updateOrganization',
    data:data,
    method: 'put',
  })
}
