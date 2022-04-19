const {
  Sequelize
} = require('sequelize');
var runtimeLogger = require('../logs/log4')();
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require("../const/const");
console.log("MYSQL_DB", MYSQL_DB)
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql'
})
const connect = async () => {
  try{
    let res = await seq.authenticate();
    runtimeLogger.info(`连接数据库成功:${res}`)
  }catch (e) {
    runtimeLogger.error(`连接数据库:${e}`)
  }
}
connect();
module.exports = seq;
