import axios from '@/utils/request'
import qs from 'qs'

/**
 * 审核计划材料
 */
export const materialReview = (data) => {
  return axios({
    url: '/web/ppc/plan/approval/materialReview',
    method: 'post',
    data:data
  })
}
/**
 * 查询计划材料审核列表
 */
export const queryMaterialReviewList = (data) => {
  return axios({
    url: '/web/ppc/plan/approval/queryMaterialReviewList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询计划材料审核进度
 */
export const queryMaterialReviewProgress = (data) => {
  return axios({
    url: '/web/ppc/plan/approval/queryMaterialReviewProgress?'+qs.stringify(data),
    method: 'get',
  })
}

/**
 * 查询计划材料审核状态
 */
export const queryMaterialReviewStatus = (data) => {
  return axios({
    url: '/web/ppc/plan/approval/queryMaterialReviewStatus?'+qs.stringify(data),
    method: 'get',
  })
}

/**
 * 查询计划材料信息
 */
export const queryPlanMaterial = (data) => {
  return axios({
    url: '/web/ppc/plan/approval/queryPlanMaterial?'+qs.stringify(data),
    method: 'get',
  })
}
