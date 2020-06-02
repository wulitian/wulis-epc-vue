import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除合同台账信息(通过id)
 */
export const deleteContractInfoByid = (data) => {
  return axios({
    url: '/web/pcm/contract/info/deleteContractInfo',
    method: 'delete',
    data:data
  })
}
/**
 * 新增合同台账信息
 */
export const insertContractInfo = (data) => {
  return axios({
    url: '/web/pcm/contract/info/insertContractInfo',
    method: 'post',
    data:data
  })
}
/**
 * 查询合同台账信息(通过id)
 */
export const queryContractInfoByid = (data) => {
  return axios({
    url: '/web/pcm/contract/info/queryContractInfo?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询合同台账信息列表（全量）
 */
// export const queryContractCategoryList = () => {
//   return axios({
//     url: '/web/pcm/contract/category/queryContractCategoryList',
//     method: 'get',
//   })
// }
/**
 * 查询合同台账信息列表（分页）
 */
export const queryContractInfoPage = (data) => {
  return axios({
    url: '/web/pcm/contract/info/queryContractInfoPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改合同台账信息
 */
export const updateContractInfo = (data) => {
  return axios({
    url: '/web/pcm/contract/info/updateContractInfo',
    data:data,
    method: 'put',
  })
}
/**
 * 合同附件上传
 */
export const attachmentUpload = (data) => {
  return axios({
    url: '/web/pcm/contract/info/uploadContractInfo',
    data:data,
    method: 'post',
  })
}
