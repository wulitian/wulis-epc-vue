'use strict'

/*!
 构建的时候用到的webpack配置来自webpack.prod.conf.js，该配置同样是在webpack.base.conf基础上的进一步完善。主要完成下面几件事情：
　　1.合并基础的webpack配置
　　2.配置样式文件的处理规则，styleLoaders
　　3.配置webpack的输出
　　4.配置webpack插件
　　5.gzip模式下的webpack插件配置
　　6.webpack-bundle分析
 * https://github.com/wulitian/wulitian-ui
 */
// node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')
// 引入utils.js模块
const utils = require('./utils')
// 引入webpack模块
const webpack = require('webpack')
// 引入配置文件
const config = require('../config')
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
// 引入基本webpack基本配置
const baseWebpackConfig = require('./webpack.base.conf')
// 在webpack中拷贝文件和文件夹
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 文件名即使更改，自动打包并且生成响应的文件在index.html里面
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//一个用来压缩优化CSS大小的东西
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 一个用来压缩优化JS大小的东西
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 引入生产环境
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')
// 将webpack基本配置和生产环境配置合并在一起，生成css,postcss,less等规则，并进行模块转换，转换成webpack可识别的文件，进行解析
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 将CSS提取到单独文件中去
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 是否使用sourcemap
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 文件打包的输出路径
    path: config.build.assetsRoot,
    // 主文件入口文件名字
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 非主文件入口文件名，可以存放cdn的地址
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 一个用来压缩优化JS大小的东西
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    //一个用来压缩优化CSS大小的东西
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        // 删除index.html中的注释
        removeComments: true,
        // 删除index.html中的空格
        collapseWhitespace: true,
        // 删除各种html标签属性值的双引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // 注入依赖的时候按照依赖先后顺序进行注入，比如，需要先注入vendor.js，再注入app.js
      chunksSortMode: 'dependency'
    }),
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
    new webpack.HashedModuleIdsPlugin(),
    // 预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 把webpack的runtime和manifest这些webpack管理所有模块交互的代码打包到[name].js文件中,防止build之后vendor的hash值被更新[疑问]
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // 在webpack中拷贝文件和文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// 提供带 Content-Encoding 编码的压缩版的资源
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户。
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
