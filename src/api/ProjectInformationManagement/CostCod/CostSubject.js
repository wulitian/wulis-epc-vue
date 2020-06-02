import axios from '@/utils/request'
import qs from 'qs'

/**
 * 新增成本科目
 */
export const insertSubject = (data) => {
  return axios({
    url: '/web/epc/cost/subject',
    method: 'post',
    data:data
  })
}
/**
 * 修改成本科目
 */
export const updateSubject = (data) => {
  return axios({
    url: '/web/epc/cost/subject',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除成本科目
 */
export const batchDeleteSubject = (data) => {
  return axios({
    url: '/web/epc/cost/subject/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询成本科目列表(字典全量)
 */
export const querySubjectList = () => {
  return axios({
    url: '/web/epc/cost/subject/getDictList',
    method: 'get',
  })
}
/**
 * 查询成本科目列表(分页)
 */
export const querySubjectPage = (data) => {
  return axios({
    url: '/web/epc/cost/subject/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除成本科目根据id
 */
export const deleteSubjectByid = (data) => {
  return axios({
    url: '/web/epc/cost/subject/'+data.id,
    method: 'delete',
  })
}
