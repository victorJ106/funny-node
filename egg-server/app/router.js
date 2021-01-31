'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);


  router.group({name: 'user', prefix: '/user'}, router => {
    const { login } = controller.user;
    router.get('/login', login);
  })
};
