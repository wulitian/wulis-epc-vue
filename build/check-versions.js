'use strict'
/*!
 * 若要执行build.js构建打包文件，必须先进行npm和node版本的检测。
 * 进行npm、node版本检查(版本不相对时，会出现无法打包，某些文件无法正常编译运行的情况)
 * https://github.com/wulitian/wulitian-ui
 */
// chalk插件，他的作用是在控制台中输出不同的颜色的字，大致这样用chalk.blue('Hello world')，这款插件只能改变命令行中的字体颜色
const chalk = require('chalk')
// npm版本号的检查
const semver = require('semver')
// 引入包的json文件
const packageConfig = require('../package.json')
// shelljs插件，作用是用来执行Unix系统命
const shell = require('shelljs')
//脚本可以通过child_process 模块新建子进程，从而执行 Unix 系统命令
//这段代码实际就是把cmd这个参数传递的值转化成前后没有空格的字符串，也就是版本号
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}
// 检查node版本信息。
// 一:使用semver插件把版本信息转化成规定格式，也就是 '  =v1.2.3  ' -> '1.2.3' 这种功能
// 二:这是规定的pakage.json中engines选项的node版本信息 "node":">= 4.0.0"
const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
]
// 检查npm版本信息
// 一:自动调用npm --version命令，并且把参数返回给exec函数，从而获取纯净的版本号
// 二:这是规定的pakage.json中engines选项的node版本信息 "npm": ">= 3.0.0"
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}
// 进行版本检查，这里主要用到semver的模块,semver.satisfies(version,range),如果版本不在这个范围内，则进行报错
// range  eg:
// ^1.2.3 ：= >=1.2.3 <2.0.0
// ^0.2.3 ：= >=0.2.3 <0.3.0
// ^0.0.3 ：= >=0.0.3 <0.0.4
module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }
  // 能否正常的运行dev-server
  // 传送门：http://javascript.ruanyifeng.com/nodejs/process.html#toc9
  // process.exit方法用来退出当前进程。它可以接受一个数值参数，如果参数大于0，表示执行失败；如果等于0表示执行成功。
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
