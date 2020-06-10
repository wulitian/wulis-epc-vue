import axios from '@/utils/request'
import qs from 'qs'

/**
 * 申请下一个计划流程(施工方：开始施工、中期施工)
 */
export const applyNextPlanProcess = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/applyNextPlanProcess',
    data:data,
    method: 'put',
  })
}
/**
 * 同意/驳回:进入下一个计划流程
 */
export const approvalNextPlanProcess = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/approvalNextPlanProcess',
    data:data,
    method: 'put',
  })
}
/**
 * 新增合同
 */
export const insertPlanContract = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/insertPlanContract',
    method: 'post',
    data:data
  })
}
/**
 * 新增报告
 */
export const insertPlanReport = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/insertPlanReport',
    method: 'post',
    data:data
  })
}
/**
 * 查询当前审批计划流程状态
 */
export const queryApprovalStatus = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/queryApprovalStatus',
    method: 'put',
    data:data
  })
}

/**
 * 查询计划上传材料列表(分页)
 */
export const queryPlanMaterialPage = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/queryPlanMaterialPage?'+qs.stringify(data),
    method: 'get',
  })
}

/**
 * 上传计划材料
 */
export const uploadReport = (data) => {
  return axios({
    url: '/web/cmi/file/upload',
    method: 'post',
    data:data
  })
}
