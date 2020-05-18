'use strict'
/*!
 * 该文件主要来设置测试环境变量。
 * https://github.com/wulitian/wulitian-ui
 */
//NODE_ENV决定测试环境
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_ROOT: '"http://127.0.0.1:8080"'
})
