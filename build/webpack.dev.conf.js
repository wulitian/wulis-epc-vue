'use strict'
/*!
 * 当执行npm run dev时，我们执行的就是该js文件，该文件主要完成以下任务：
 *１.引入相关插件和配置
 *2.生成处理各种样式的规则
 *3.配置开发环境，如热更新、监听端口号，是否自动打开浏览器等都在webpack中的devServer中配置完成
 *4.寻找可利用的端口和添加显示程序编译运行时的错误信息。
 * https://github.com/wulitian/wulitian-ui
 */
// utils提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数。
const utils = require('./utils')
// 引入webpack模块
const webpack = require('webpack')
// 引入配置文件默认是index文件
const config = require('../config')
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
// 引入访问文件path
const path = require('path')
// 引入webpack基本配置
const baseWebpackConfig = require('./webpack.base.conf')
// 在webpack中拷贝文件和文件夹
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 文件名即使更改，自动打包并且生成响应的文件在index.html里面
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 可识别某些类型的webpack错误并清理，汇总和优先化它们以提供更好的开发者体验
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查看空闲端口位置，默认情况下搜索8000这个端口，
const portfinder = require('portfinder')
// processs为node的一个全局对象获取当前程序的环境变量，HOST(域名)，
const HOST = process.env.HOST
// processs为node的一个全局对象获取当前程序的环境变量，PORT(端口)，
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
  // 自动生成了css,postcss,less等规则，并进行模块转换，转换成webpack可识别的文件，进行解析转换
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // 增加调试信息
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 在开发工具(DevTools)的控制台将显示消息【如：在重新加载之前，在一个错误之前，或者模块热替换(HMR)启动时，这可能显示得很繁琐】
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // 启动模块热更新特性
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    // 一切服务都启动用gzip方式进行压缩代码
    compress: true,
    // 指定使用一个host,默认是localhost,获取HOST地址，该文件定义或config中index里的dev配置里获取
    host: HOST || config.dev.host,
    // 指定要监听的端口号
    port: PORT || config.dev.port,
    // 发开服务器是否自动代开默认浏览器
    open: config.dev.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方。{warning:false,errors:true}这个选项为 显示错误和警告
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 服务器假设运行在http://localhost:8080并且output.filename被设置为bundle.js默认。publicPath是"/"，所以你的包（束）通过可以http://localhost:8080/bundle.js访问。
    // 比如将config中的index.js dev对象的中的assertsPublicPath设置为"/asserts/"那么文件打开后将通过http://localhost:8080/asserts/来进行访问
    publicPath: config.dev.assetsPublicPath,
    // 如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL将很有用.简称就是API代理,中间件  需引入 http-proxy-middleware
    proxy: config.dev.proxyTable,
    // 启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见。
    quiet: true,
    // webpack使用文件系统（file system）获取文件改动的通知
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // 将DefinePlugin允许您创建可在配置全局常量的编译时间。这对于允许开发构建和发布构建之间的不同行为是有用的
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 永远不能用在生产模式，模块热更新,修改文件的内容，允许在运行时更新各种模块，而无需进行完全刷新。
    new webpack.HotModuleReplacementPlugin(),
    // 当进行热更新时，相关文件名会被展示出来
    new webpack.NamedModulesPlugin(),
    // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
    new webpack.NoEmitOnErrorsPlugin(),
    // 该插件可自动生成一个 html5 文件或使用模板文件将编译好的代码注入进去
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    // 如果我们需要在我们的项目中直接复制一个文件到打包后的路径中
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  //由于portfinder这个插件本身是从8000开始查找，这里设置查找的默认端口号
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 如果端口被占用就对进程设置端口
      process.env.PORT = port
      // 如果端口被占用就设置devServer的端口
      devWebpackConfig.devServer.port = port

      // 添加错误友好提示插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // 添加提示信息，所在域名和端口的提示信息
        onErrors: config.dev.notifyOnErrors
          // 窗口提示信息,调用utils工具函数的createNotifierCallBack()方法
        ? utils.createNotifierCallback()
        : undefined
      }))
      // 如果找到能用的端口号，就把配置信息提示抛出去
      resolve(devWebpackConfig)
    }
  })
})
