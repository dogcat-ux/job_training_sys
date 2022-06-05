const {fail, success} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const koaRouter = require("koa-router");
const proStuRouter = new koaRouter({prefix: '/pro'})
const {DataTypes} = require('sequelize');
const seq = require("../db/seq")
const {findStuExistedByStuId,findProExistedByProId} = require("../middleware/pro.middleware")
const pro_stu = require("../models/programs.js")(seq, DataTypes);

//post 参数 pro_id stu_id
// proStuRouter.post('/addPro', async (ctx, next) => {
//   await commonFun(ctx, "/pro/addPro", async () => {
//     const {
//       pro_id, stu_id
//     } = ctx.request.body;
//     //重复报名
//
//     await next();
//   }, () => {
//     ctx.body = fail("系统错误,失败")
//   })
// })

proStuRouter.get('/list', async (ctx, next) => {
  const {
      pageSize,pageNum
  } = ctx.request.body;
  await commonFun(ctx, "/pro/addPro", async () => {
    const {
      pro_id, stu_id
    } = ctx.request.body;
    //重复报名
    await next();

  }, () => {
    ctx.body = fail("系统错误,失败")
  })
})

module.exports = proStuRouter;


