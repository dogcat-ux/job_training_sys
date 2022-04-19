let runtimeLogger = require('../logs/log4')();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {fail} = require("../const/code");
const {commonFun} = require("../logs/commonLog");

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

const findUserExisted = async (ctx, next) => {
  await commonFun(ctx, "findUserExisted", async () => {
    const {user_name} = ctx.request.body;
  }, async () => {
    ctx.body = fail("系统错误,用户规则验证失败")
  })
}

const cryptPassword = async (ctx, next) => {
  const {password} = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  ctx.request.body.password = bcrypt.hashSync(password, salt);
  await next();
}

const loginValidator = async (ctx, next) => {
  const {user_name, password} = ctx.request.body;
  try {
    const res = await getUserInfo({user_name});
    if (res && bcrypt.compareSync(password, res?.password || '')) {
      await next();
    } else {
      ctx.app.emit("error", userInfoErr, ctx);
      runtimeLogger.warn(`100用户名或密码错误`);
    }
  } catch (e) {
    runtimeLogger.error(`100用户登录失败${e}`);
    ctx.app.emit("error", catchErr, ctx);
  }
}

module.exports = {
  userValidator, findUserExisted, cryptPassword, loginValidator
}
