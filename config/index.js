'use strict'
/*!
 * config文件夹下，最主要的就是index.js文件，保存着开发环境和生产环境所需要的信息。
 * https://github.com/wulitian/wulitian-ui
 */
// node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')

module.exports = {
  dev: {

    // 二级目录，存放静态资源文件的目录，位于dist文件夹下
    assetsSubDirectory: 'static',
    // 发布路径，如果构建后的产品文件有用于CDN或者放到其他域名服务器，可以在这里设置，当然本地打包，本地浏览一般都将这里设置为"./"
    // 设置之后的构建的产品在注入到index.html中就会带上这里的发布路径
    assetsPublicPath: '/',
    // 代理示例： proxy: [{context: ["/auth", "/api"],target: "http://localhost:3000",}]
    proxyTable: {},
    // 各种开发服务器的配置
    host: '127.0.0.1', // 这个可以被process.env.HOST重写
    port: 8081, // process.env.PORT重写  在端口空闲的情况下
    autoOpenBrowser: false, // 是否自动打开浏览器
    errorOverlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方。{warning:false,errors:true}这个选项为 显示错误和警告
    notifyOnErrors: true, // 是否允许窗口弹出错误信息
    poll: false, // webpack使用文件系统（file system）获取文件改动的通知


    /**
     * Source Maps
     */

    // 开启调试的类型
    devtool: 'cheap-module-eval-source-map',
    // 是否通过将哈希查询附加到文件名来生成具有缓存清除的源映射[疑问，求解]
    cacheBusting: true,
    // 开发环境下，不显示cssSourceMap
    cssSourceMap: true
  },

  build: {
    //  获得绝对路径，inde.html的模板文件
    index: path.resolve(__dirname, '../dist/index.html'),
    // 获得dist文件夹的绝对路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 二级目录
    assetsSubDirectory: 'static',
    // 发布路径，如果构建后的产品文件有用于CDN或者放到其他域名服务器，可以在这里设置，当然本地打包，本地浏览一般都将这里设置为"./"
    // 设置之后的构建的产品在注入到index.html中就会带上这里的发布路径
    assetsPublicPath: './',
    /**
     * Source Maps
     */
    // production环境下生成sourceMap文件
    productionSourceMap: true,
    // 开启调试的类型
    devtool: '#source-map',
    // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // 是否展示webpack构建打包之后的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
