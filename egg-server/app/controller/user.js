const BaseController = require('./base');

class UserController extends BaseController {

  async login() {
    console.log('登录=====')
    const { ctx, app } = this;
    this.success({aa: '2222'});
  }
}

module.exports = UserController;