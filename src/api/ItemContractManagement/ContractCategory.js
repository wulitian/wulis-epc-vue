import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除合同类目信息(通过id)
 */
export const deleteContractCategoryByid = (data) => {
  return axios({
    url: '/web/pcm/contract/category/deleteContractCategory',
    method: 'delete',
    data:data
  })
}
/**
 * 新增合同类目信息
 */
export const insertContractCategory = (data) => {
  return axios({
    url: '/web/pcm/contract/category/insertContractCategory',
    method: 'post',
    data:data
  })
}
/**
 * 查询合同类目信息(通过id)
 */
export const queryContractCategoryByid = (data) => {
  return axios({
    url: '/web/pcm/contract/category/queryContractCategory?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询合同类目信息列表（全量）
 */
export const queryContractCategoryList = () => {
  return axios({
    url: '/web/pcm/contract/category/queryContractCategoryList',
    method: 'get',
  })
}
/**
 * 查询合同类目信息列表（分页）
 */
export const queryContractCategoryPage = (data) => {
  return axios({
    url: '/web/pcm/contract/category/queryContractCategoryPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改合同类目信息
 */
export const updateContractCategory = (data) => {
  return axios({
    url: '/web/pcm/contract/category/updateContractCategory',
    data:data,
    method: 'put',
  })
}
/**
 * 合同附件上传
 */
export const uploadContractInfo = (data) => {
  return axios({
    url: '/web/pcm/contract/info/uploadContractInfo',
    data:data,
    method: 'post',
  })
}
