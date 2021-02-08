'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);

  router.get('/captcha', controller.common.captcha);
  router.get('/sendMailCode', controller.common.sendMailCode);


  router.group({ name: 'user', prefix: '/user' }, router => {
    const { login, register } = controller.user;
    router.post('/login', login);
    router.post('/register', register);
  });
};
