import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除项目计划(根据id)
 */
export const deletePlanById = (data) => {
  return axios({
    url: '/web/ppc/plan/deletePlan',
    method: 'delete',
    data:data
  })
}
/**
 * 新增项目计划
 */
export const insertPlan = (data) => {
  return axios({
    url: '/web/ppc/plan/insertPlan',
    method: 'post',
    data:data
  })
}
/**
 * 查询项目计划(通过id)
 */
export const queryPlanByid = (data) => {
  return axios({
    url: '/web/ppc/plan/queryPlan?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询项目计划列表(分页:施工方)
 */
export const queryPlanPage = (data) => {
  return axios({
    url: '/web/ppc/plan/queryPlanPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询项目计划列表(分页:审核方)
 */
export const queryPlanAllPage = (data) => {
  return axios({
    url: '/web/ppc/plan/queryPlanAllPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改项目计划
 */
export const updatePlan = (data) => {
  return axios({
    url: '/web/ppc/plan/updatePlan',
    data:data,
    method: 'put',
  })
}
/**
 * 查询计划详情
 */
export const queryPlanDetail = (data) => {
  return axios({
    url: '/web/ppc/plan/detail/queryPlanDetail?'+qs.stringify(data),
    method: 'get',
  })
}
