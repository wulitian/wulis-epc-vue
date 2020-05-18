'use strict'
/*!
 *该文件的主要作用就是处理.vue文件，解析这个文件中的每个语言块（template、script、style),转换成js可用的js模块。
 */
// 引入utils.js相关模块
const utils = require('./utils')
// 默认是index.js文件
const config = require('../config')
//判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  //判定特定环境下sourceMap的值
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
// 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为 require 调用，以便目标资源可以由 webpack 处理.
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    // 是否将样式提取到单独的文件
    extract: isProduction
  }),
  // 是否开启cssSourceMap, 关闭可以避免 css-loader 的 some relative path related bugs 同时可以加快构建速度。
  cssSourceMap: sourceMapEnabled,
  // 是否通过将哈希查询附加到文件名来生成具有缓存清除的源映射[疑问，求解]
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
