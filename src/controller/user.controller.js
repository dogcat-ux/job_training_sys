
const {fail, success} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const koaRouter = require("koa-router");
const userRouter = new koaRouter({prefix: '/users'})
const {DataTypes} = require('sequelize');
const seq = require("../db/seq")
const {cryptPassword, findUserNoExisted, loginValidator,studentValidator} = require("../middleware/user.middleware");
const {findUserExisted} = require("../middleware/user.middleware");
const {userValidator} = require("../middleware/user.middleware");
const User = require("../models/user.js")(seq, DataTypes);
const Student = require("../models/student.js")(seq, DataTypes);

//post 参数 password username
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - user
 *     summary: 注册
 *     parameters:
 *       - name: password
 *         description: 密码
 *         type: string
 *       - name: name
 *         description: 用户名
 *         type: string
 */
userRouter.post('/register', userValidator,
    findUserExisted, cryptPassword,
    async (ctx, next) => {
      await commonFun(ctx, "register", async () => {
        const {username, password} = ctx.request.body;
        //检验信息完全
        //调用数据库存储数据
        await User.create({userName: username, passWord: password, role: 0})
        ctx.body = success("注册成功")
        await next();
      }, () => {
        ctx.body = fail("系统错误,注册失败")
      })
    })

//post 参数 password username
userRouter.post('/login', findUserNoExisted, loginValidator, async (ctx, next) => {
  await commonFun(ctx, "register", async () => {
    ctx.body = success("登录成功")
    await next();
  }, () => {
    ctx.body = fail("系统错误,注册失败")
  })
})

//PUT 参数 realName phone email username
userRouter.put('/amendInfo', studentValidator, async (ctx, next) => {
  const {realName, phone, email, username} = ctx.request.body;
  let user = await User.findOne({where: {userName: username}});
  await Student.update({realName, phone, email}, {
    where: {
      user_id: user.id
    }
  });
  await next();
})

module.exports = userRouter;


