let runtimeLogger = require('../logs/log4')();
const Joi = require('joi');
const {FailureBehavior} = require("../const/code");
const bcrypt = require('bcryptjs');
const {fail} = require("../const/code");
const {commonFun} = require("../logs/commonLog");
const seq = require("../db/seq")
const {DataTypes} = require('sequelize');
const User = require("../models/user")(seq, DataTypes);

//用户信息规则校验
const userValidator = async (ctx, next) => {
  await commonFun(ctx, "userValidator", async () => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(16).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,16}$/).required(),
    })
    let value = schema.validate(ctx.request.body);
    if (value.error) {
      ctx.body = fail("请输入符合条件的账号密码")
    } else {
      await next();
    }
  }, async () => {
    ctx.body = fail("系统错误,用户规则验证失败")
  })
}
//用户真实信息规则校验
const studentValidator = async (ctx, next) => {
  await commonFun(ctx, "userValidator", async () => {
    const schema = Joi.object({
      realName: Joi.string().alphanum().min(3).max(16).required(),
      phone: Joi.string().regex(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).required(),
      email: Joi.string().regex(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).required(),
    })
    let value = schema.validate(ctx.request.body);
    if (value.error) {
      ctx.body = fail("请输入符合条件的信息")
    } else {
      await next();
    }
  }, async () => {
    ctx.body = fail("系统错误,用户规则验证失败")
  })
}

//查看用户是否存在
const findUserExisted = async (ctx, next) => {
  await commonFun(ctx, "findUserExisted", async () => {
    const {username} = ctx.request.body;
    let hasExisted = await User.findOne({where: {userName: username}});
    if (hasExisted) ctx.body = fail("注册失败,该用户已存在", null, FailureBehavior)
    await next()
  }, async () => {
    ctx.body = fail("系统错误!")
  })
}

//密码加密
const cryptPassword = async (ctx, next) => {
  const {password} = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  ctx.request.body.password = bcrypt.hashSync(password, salt);
  await next();
}

//登录验证
const findUserNoExisted = async (ctx, next) => {
  await commonFun(ctx, "loginValidator", async () => {
    const {username} = ctx.request.body;
    let hasExisted = await User.findOne({where: {userName: username}});
    if (!hasExisted) ctx.body = fail("操作失败,该用户不存在", null, FailureBehavior)
    await next()
  }, async () => {
    ctx.body = fail("系统错误!")
  })
}

const loginValidator = async (ctx, next) => {
  await commonFun(ctx, "loginValidator", async () => {
    const {username, password} = ctx.request.body;
    let user = await User.findOne({where: {userName: username}});
    if (!user) ctx.body = fail("操作失败,该用户不存在", null, FailureBehavior)
    if (user.userName === username && bcrypt.compareSync(password, user.passWord)
    ) {
      await next()
    } else {
      ctx.body = fail("登录失败，用户名或密码错误", null, FailureBehavior)
    }
  }, async () => {
    ctx.body = fail("系统错误!")
  })
}

module.exports = {
  userValidator, findUserExisted, cryptPassword, loginValidator, findUserNoExisted,studentValidator
}
