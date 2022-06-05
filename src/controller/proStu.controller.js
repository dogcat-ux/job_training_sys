const {fail, success} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const koaRouter = require("koa-router");
const proStuRouter = new koaRouter({prefix: '/proStu'})
const {DataTypes} = require('sequelize');
const seq = require("../db/seq")
const {findStuExistedByStuId,findProExistedByProId} = require("../middleware/pro.middleware")
const pro_stu = require("../models/pro_stu.js")(seq, DataTypes);

//post 参数 pro_id stu_id
proStuRouter.post('/join',findStuExistedByStuId,findProExistedByProId, async (ctx, next) => {
  await commonFun(ctx, "/proStu/join", async () => {
    const {pro_id, stu_id} = ctx.request.body;
    //重复报名
    const hasProStu = await pro_stu.findOne({where: {pro_id, stu_id}})
    if (hasProStu) {
      ctx.body = fail("您已报名该活动，请勿重复报名！")
    } else {
      await pro_stu.create({pro_id, stu_id})
      ctx.body = success("报名成功！")
    }
    await next();
  }, () => {
    ctx.body = fail("系统错误,失败")
  })
})

module.exports = proStuRouter;


