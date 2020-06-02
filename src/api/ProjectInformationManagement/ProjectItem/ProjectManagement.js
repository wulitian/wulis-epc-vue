import axios from '@/utils/request'
import qs from 'qs'

/**
 * 新增工程
 */
export const insertEngineeringManage = (data) => {
  return axios({
    url: '/web/epc/engineering/manage',
    method: 'post',
    data:data
  })
}
/**
 * 修改工程
 */
export const updateEngineeringManage = (data) => {
  return axios({
    url: '/web/epc/engineering/manage',
    data:data,
    method: 'put',
  })
}
/**
 * 附件上传
 */
export const attachmentUpload = (data) => {
  return axios({
    url: '/web/epc/engineering/manage/attachmentUpload',
    method: 'post',
    data:data
  })
}
/**
 * 批量删除工程
 */
export const batchDeleteEngineeringManage = (data) => {
  return axios({
    url: '/web/epc/engineering/manage/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询工程列表(字典全量)
 */
export const queryEngineeringManageList = (data) => {
  return axios({
    url: '/web/epc/engineering/manage/getList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询工程列表(分页)
 */
export const queryEngineeringManagePage = (data) => {
  return axios({
    url: '/web/epc/engineering/manage/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除工程根据id
 */
export const deleteEngineeringManageByid = (data) => {
  return axios({
    url: '/web/epc/engineering/manage/'+data.id,
    method: 'delete',
  })
}
