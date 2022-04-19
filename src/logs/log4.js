const log4js = require('log4js')
const path = require('path')
log4js.configure({
  appenders: { // 定义输出到哪
    console: {
      type: 'stdout'
    },
    runtime: {
      type: 'DateFile',
      pattern: '-yyyy-MM-dd.log',
      daysToKeep: 5, // 删除5天前的日志
      filename: path.join(__dirname, 'runtime.log'),
      keepFileExt: false,
      compress: true
    },
    access: {
      type: 'DateFile',
      pattern: '-yyyy-MM-dd.log',
      daysToKeep: 5,
      filename: path.join(__dirname, 'access.log'),
      keepFileExt: false,
      compress: true
    }
  },
  categories: { // 定义两个分类，外部实例化的时候可以任选其一
    access: { appenders: ['console', 'access'], level: 'debug' },
    default: { appenders: ['console', 'runtime'], level: 'debug' }
  }
})

module.exports = function getLogger(category) {
  return log4js.getLogger(category)
}
