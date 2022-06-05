const {fail} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const {DataTypes} = require('sequelize');
const seq = require("../db/seq")
const pros = require("../models/programs.js")(seq, DataTypes);
const stu = require("../models/student.js")(seq, DataTypes);

const findProExistedByProId = async (ctx, next) => {
  await commonFun(ctx, "findProExistedByProId", async () => {
    const {pro_id} = ctx.request.body;
    //重复报名
    const hasPro = await pros.findOne({where: {id: pro_id}})
    if (!hasPro) ctx.body = fail("该项目不存在！")
    else await next()
  }, async () => {
    ctx.body = fail("系统错误!")
  })
}

const findStuExistedByStuId = async (ctx, next) => {
  await commonFun(ctx, "findStuExistedByStuId", async () => {
    const {stu_id} = ctx.request.body;
    //重复报名
    const hasStu = await stu.findOne({where: {id: stu_id}});
    if (!hasStu) ctx.body = fail("该学生不存在！");
    else await next();
  }, async () => {
    ctx.body = fail("系统错误!")
  })
}

module.exports = {findStuExistedByStuId, findProExistedByProId}
