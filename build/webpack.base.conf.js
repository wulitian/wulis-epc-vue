'use strict'
/*!
 * 从webpack.dev.conf.js来看文件中引入了utils.js工具类函数和config文件夹中的index.js环境配置模块，以及引入了webpack.base.conf.js基础（开发和生产环境公共）配置。所以这里先分析webpack.base.conf.js文件。
 * webpack.base.conf.js主要完成了下面这些事件:
 * １.配置webpack编译入口
 * 2.配置webpack输出路径和命名规则
 * 3.配置模块resolve规则
 * 4.配置不同类型模块的处理规则
 * https://github.com/wulitian/wulitian-ui
 */
// 为了使用webpack内部方法
const webpack = require('webpack')
// node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')
// 引入utils.js模块
const utils = require('./utils')
// 默认是index文件，引入index.js模块
const config = require('../config')
// vue-loader.conf配置文件是用来解决各种css文件的，定义了诸如css,less,sass之类的和样式有关的loader
const vueLoaderConfig = require('./vue-loader.conf')
// 此函数是用来返回当前目录的平行目录的路径，因为有个'..'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  //基础目录（绝对路径），用于从配置中解析入口点和加载程序
  context: path.resolve(__dirname, '../'),
  // 定义入口文件
  entry: {
    app: './src/main.js'
  },
  // 打包生成的出口文件所放的位置
  output: {
    path: config.build.assetsRoot,
    // 打包生成app.js文件
    filename: '[name].js',
    // 项目上线地址，也就是真正的文件引用路径，如果是production环境，其实这里都是'/'
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 省略扩展名，比方说import index from '../js/index'会默认去找index文件，然后找index.js,index.vue,index.json文件
    extensions: ['.js', '.vue', '.json'],
    // 使用别名  使用上面的resolve函数，意思就是用@代替src的绝对路径
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      /*解决static打包后js中引用static找不到问题(经过配置模板中js必须用static,css中必须全路径引用必须全路径，html中随意)*/
      'static':path.resolve(__dirname,'../../static')
    }
  },
  // 不同文件模块使用不同的loader
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  //这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行.
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  //引入jquery解决$ undefined问题
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ]
}
