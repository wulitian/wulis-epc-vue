import axios from '@/utils/request'
import qs from 'qs'

/**
 * 新增工程类型
 */
export const insertEngineeringType = (data) => {
  return axios({
    url: '/web/epc/engineering/type',
    method: 'post',
    data:data
  })
}
/**
 * 修改工程类型
 */
export const updateEngineeringType = (data) => {
  return axios({
    url: '/web/epc/engineering/type',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除工程类型
 */
export const batchDeleteEngineeringType = (data) => {
  return axios({
    url: '/web/epc/engineering/type/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询工程类型列表(字典全量)
 */
export const queryEngineeringTypeList = () => {
  return axios({
    url: '/web/epc/engineering/type/getDictList',
    method: 'get',
  })
}
/**
 * 查询工程类型列表(分页)
 */
export const queryEngineeringTypePage = (data) => {
  return axios({
    url: '/web/epc/engineering/type/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除工程类型根据id
 */
export const deleteEngineeringTypeByid = (data) => {
  return axios({
    url: '/web/epc/engineering/type/'+data.id,
    method: 'delete',
  })
}
