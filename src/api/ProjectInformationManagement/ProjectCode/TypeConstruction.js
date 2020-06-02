import axios from '@/utils/request'
import qs from 'qs'

/**
 * 添加结构形式
 */
export const insertEngineeringStructure = (data) => {
  return axios({
    url: '/web/epc/engineering/structure',
    method: 'post',
    data:data
  })
}
/**
 * 修改结构形式
 */
export const updateEngineeringStructure = (data) => {
  return axios({
    url: '/web/epc/engineering/structure',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除结构形式
 */
export const batchDeleteEngineeringStructure = (data) => {
  return axios({
    url: '/web/epc/engineering/structure/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询结构形式字典列表(全量)
 */
export const queryEngineeringStructureList = () => {
  return axios({
    url: '/web/epc/engineering/structure/getDictList',
    method: 'get',
  })
}
/**
 * 查询结构形式分页列表(分页)
 */
export const queryEngineeringStructurePage = (data) => {
  return axios({
    url: '/web/epc/engineering/structure/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除结构形式根据id
 */
export const deleteEngineeringStructureByid = (data) => {
  return axios({
    url: '/web/epc/engineering/structure/'+data.id,
    method: 'delete',
  })
}
