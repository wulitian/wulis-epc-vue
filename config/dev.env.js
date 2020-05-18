'use strict'
/*!
 * 该文件主要来设置开发环境变量。
 * https://github.com/wulitian/wulitian-ui
 */
// 引入webpack-merge模块
const merge = require('webpack-merge')
// 引入生产环境配置
const prodEnv = require('./prod.env')
// 配置NODE_ENV来决定开发环境
// 这个就是用来上线的时候用到，来决定是开发环境还是生产环境，来进行相关的配置解决方案
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://127.0.0.1:8080"'
})
