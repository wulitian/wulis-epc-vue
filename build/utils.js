'use strict'
// node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')
// 引入config中的index.js文件
const config = require('../config')
// extract-text-webpack-plugin可以提取bundle中的特定文本，将提取后的文本单独存放到另外的文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入包的json文件
const packageConfig = require('../package.json')
// 资源存放的路径，区别在于生产环境和开发环境
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  // path.posix以posix兼容的方式交互，是跨平台的，如果是path.win32的话，只能在win上
  return path.posix.join(assetsSubDirectory, _path)
}
// cssLoaders将各种loader 转成对象形式以便styleLoaders进行处理
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      // 是否使用sourceMap
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      // 是否使用sourceMap,postcss-loader用来解决各浏览器的前缀问题
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 判断将cssLoader和postcssLoader推入loaders数组
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      // 处理各种各样的loader,并且将各种各样的loader推入loaders数组当中去
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    //如果options.extract存在,则用extract-text-plugin提取样式
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath:'../../'
      })
    } else {
      // 无需提取样式则简单使用vue-style-loader配合各种样式loader去处理vue当中的<style>里面的样式
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // cssLoaders将各种loader 转成对象形式以便styleLoaders进行处理
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
//  styleLoaders进行再加工处理
//  生成处理单独的.css、.sass、.scss等样式文件的规则
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
// 引入node-notifier模块，这个模块是用来在桌面窗口提示信息，如果想要关闭直接return掉或者在webpack.dev.conf.js中关掉
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return
    // 每次捕获第一个错误
    const error = errors[0]
    // 错误文件的名称所在位置
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      // 错误提示项目名字
      title: packageConfig.name,
      // 错误提示类型
      message: severity + ': ' + error.name,
      //  错误提示副标题
      subtitle: filename || '',
      // 错误提示图示标
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
