const Koa = require("koa");
const app = new Koa();
const KoaBody = require("koa-body");
const {APP_PORT} = require("./const/const")
const userRouter = require("./controller/user.controller")
app.use(KoaBody())
//路由
app.use(userRouter.routes()).use(userRouter.allowedMethods()).use(() => {
  console.log("中间件调用")
});
//错误处理
app.on("error", (err, ctx) => {
  let status;
  switch (err.code) {
    case 10001:
      status = 409
      break;
    case 11001:
      status = 500
      break;
    default:
      status = 200
  }
  ctx.status = status;
  ctx.body = err;
})
app.listen(APP_PORT, () => {
  console.log("监听3000端口")
})
