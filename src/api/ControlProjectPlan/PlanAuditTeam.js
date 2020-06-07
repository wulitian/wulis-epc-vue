import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除审核组信息(根据id)
 */
export const deleteReviewTeamById = (data) => {
  return axios({
    url: '/web/ppc/review/team/deleteReviewTeam',
    method: 'delete',
    data:data
  })
}
/**
 * 新增审核组信息
 */
export const insertReviewTeam = (data) => {
  return axios({
    url: '/web/ppc/review/team/insertReviewTeam',
    method: 'post',
    data:data
  })
}
/**
 * 查询审核组信息(通过id)
 */
export const queryReviewTeamByid = (data) => {
  return axios({
    url: '/web/ppc/review/team/queryReviewTeam?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询审核组列表(全量)
 */
export const queryReviewTeamList = (data) => {
  return axios({
    url: '/web/ppc/review/team/queryReviewTeamList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询审核组列表(分页)
 */
export const queryReviewTeamPage = (data) => {
  return axios({
    url: '/web/ppc/review/team/queryReviewTeamPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改审核组信息
 */
export const updateReviewTeam = (data) => {
  return axios({
    url: '/web/ppc/review/team/updateReviewTeam',
    data:data,
    method: 'put',
  })
}
