const Koa = require("koa");
const app = new Koa();
const KoaBody = require("koa-body");
const {APP_PORT} = require("./const/const")
const userRouter = require("./controller/user.controller")
const proStuRouter = require("./controller/proStu.controller")

const swagger = require('./swagger.js')
const {koaSwagger} = require('koa2-swagger-ui')

app.use(swagger.routes(), swagger.allowedMethods())
app.use(koaSwagger({
  routePrefix: '/swagger', // api文档访问地址
  swaggerOptions: {
    url: '/swagger.json', // example path to json
  }
}))
app.use(KoaBody())
//路由
app
    .use(userRouter.routes())
    .use(proStuRouter.routes())
    .use(userRouter.allowedMethods()).use(() => {
  console.log("路由中间件调用")
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
