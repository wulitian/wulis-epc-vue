 /*
  * 响应体
  * data(数据)
  * message（返回的消息）
  * code（返回的code码）
  * timestamp（时间戳）
  * */
const responseBody = {
  data: null,
  msg: '',
  code: 0,
  timestamp: 0
}
 /*
  * 请求码
  * OK=20000;//成功
  * ERROR =20001;//失败
  * LOGINERROR =20002;//用户名或密码错误
  * ACCESSERROR =20003;//权限不足
  * */
export const code = {
   OK: 20000,
   ERROR: 20001,
   LOGINERROR: 20002,
   ACCESSERROR: 20003,
 }
 //请求基础路径
export const baseurl = process.env.API_ROOT
 //构建请求返回值
export const builder = (data, msg, code = 0, headers = {}) => {
  responseBody.data = data
  if (msg !== undefined && msg !== null) {
    responseBody.msg = msg
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}
 //获取路径传参
export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}
  //获取data传参
export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}
