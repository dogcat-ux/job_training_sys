const router = require('koa-router')()
const jsdoc = require('swagger-jsdoc')
const path = require('path')

const swaggerDefinition = {
  info: {
    title: 'API文档',
    version: '1.0',
    description: '文档',
  },
  host: 'localhost:3000',//localhost:8000/swagger
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis: ['./controller/*.js'],
};
const swaggerSpec = jsdoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
})
module.exports = router

