import axios from '@/utils/request'
import qs from 'qs'

/**
 * 新增项目类型
 */
export const insertProjectType = (data) => {
  return axios({
    url: '/web/epc/engineering/project/type',
    method: 'post',
    data:data
  })
}
/**
 * 修改项目类型
 */
export const updateProjectType = (data) => {
  return axios({
    url: '/web/epc/engineering/project/type',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除项目类型
 */
export const batchDeleteProjectType = (data) => {
  return axios({
    url: '/web/epc/engineering/project/type/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询项目类型列表(字典全量)
 */
export const queryProjectTypeList = () => {
  return axios({
    url: '/web/epc/engineering/project/type/getDictList',
    method: 'get',
  })
}
/**
 * 查询项目类型列表(分页)
 */
export const queryProjectTypePage = (data) => {
  return axios({
    url: '/web/epc/engineering/project/type/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除项目类型根据id
 */
export const deleteProjectTypeByid = (data) => {
  return axios({
    url: '/web/epc/engineering/project/type/'+data.id,
    method: 'delete',
  })
}
