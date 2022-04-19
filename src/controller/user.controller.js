const {fail, success} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const koaRouter = require("koa-router");
const {FailureBehavior} = require("../const/code");
const userRouter = new koaRouter({prefix: '/users'})
const {DataTypes} = require('sequelize');
const seq = require("../db/seq")
const {userValidator} = require("../middleware/user.middleware");
const User = require("../models/user.js")(seq, DataTypes);
userRouter.post('/register', userValidator, async (ctx, next) => {
  await commonFun(ctx, "register", async () => {
    const {username, password} = ctx.request.body;
    //检验信息完全
    if (!username && !password) {
      ctx.body = fail("注册失败,请填写完整信息", null, FailureBehavior)
    } else if (await User.findOne({where: {userName: username}})) {
      //检验用户是否重复
      ctx.body = fail("注册失败,该用户已存在", null, FailureBehavior)
    } else {
      //调用数据库存储数据
      ctx.body = success("注册成功")
    }
  }, () => {
    ctx.body = fail("系统错误,注册失败")
  })
  await next;
})
userRouter.post('/login', async (ctx, next) => {

})
userRouter.post('/amendInfo', async (ctx, next) => {
})

module.exports = userRouter;


