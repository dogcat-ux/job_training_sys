let runtimeLogger = require('../logs/log4')();

const logInfo = (ctx, funName) => {
  runtimeLogger.info(`funName:${funName} 
      ctx.request.body:${JSON.stringify(ctx?.request?.body)},
      ctx.body:${JSON.stringify(ctx.body)}`);
}

const logError = (ctx, funName, e) => {
  runtimeLogger.error(`funName:${funName},
      ctx.request.body:${JSON.stringify(ctx.request.body)},
      ctx.body:${JSON.stringify(ctx.body)},
      e:${e}
      `);
}

const commonFun = async (ctx, funName, successCallback, failCallback) => {
  try {
    await successCallback();
    logInfo(ctx, funName)
  } catch (e) {
    await failCallback();
    logError(ctx, funName, e)
  }
}

module.exports = {
  logInfo, logError, commonFun
}
