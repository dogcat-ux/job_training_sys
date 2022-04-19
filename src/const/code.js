const code = {
  FailureBehavior: 400,
  NoMatch: 401,
  ServerError: 500,
  GatewayTimeout: 504
}

const success = (msg, data, status) => {
  return {
    status: 200 || status,
    data: data || null,
    msg: msg || null
  }
}

const fail = (msg, data, status) => {
  return {
    status: code.ServerError || status,
    data: data || null,
    msg: msg || null
  }
}

module.exports = {
  success, fail, ...code
}
