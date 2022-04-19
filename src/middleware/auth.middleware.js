const jwt = require("jsonwebtoken");
const {tokenInvalid} = require("../constants/return.type");
let runtimeLogger = require('../logs/log4')();
const {tokenExpires} = require("../constants/return.type");
const common = require("../constants/return.common");
const {TokenErrCode} = require("../constants/return.type");
const auth = async (ctx, next) => {
  const {authorization} = ctx.request.header;
  const token = authorization.replace('Bearer', '');
  try {
    ctx.state.user = jwt.verify(token, process.env.JWT_SECRET);
    await next()
  } catch (e) {
    switch (e.name) {
      case 'TokenExpiredError':
        runtimeLogger.error(`101token过期${e}`);
        return ctx.app.emit("error", tokenExpires, ctx);
      case 'JsonWebTokenError':
        runtimeLogger.error(`101token无效${e}`);
        return ctx.app.emit("error", tokenInvalid, ctx);
      default:
        runtimeLogger.error(`10${e.name}:${e}`);
        return ctx.app.emit("error", common(TokenErrCode, "token错误", ""), ctx);
    }
  }
}
module.exports = {
  auth
}
