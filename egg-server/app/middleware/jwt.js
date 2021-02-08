'use strict';

const jwt = require('jsonwebtoken');

module.exports = ({ app }) => {
  return async function(ctx, next) {
    const authorization = ctx.request.header.authorization;
    if (!authorization) {
      ctx.body = {
        code: -2,
        message: '用户没有登录',
      };
      return;
    }
    const token = authorization.replace('Token:', '');
    try {
      const res = jwt.verify(token, app.config.jwt.secret);
      ctx.state.email = res.email;
      ctx.state.userId = res._id;
      await next();
    } catch (err) {
      console.log(err);
    }
  };
};
