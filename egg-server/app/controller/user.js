'use strict';

const BaseController = require('./base');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const HashSalt = 'testabc123';

const UserCreateRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {

  // 检查验证码是否正确
  checkCaptcha() {
    const { ctx } = this;
    const captcha = ctx.request.body.captcha;
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误');
      return false;
    }
    return true;
  }

  async login() {
    const { ctx, app } = this;
    const { email, password } = ctx.request.body;
    if (!this.checkCaptcha()) return;
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    });
    if (!user) {
      return this.error('用户名或者密码错误');
    }
    const token = jwt.sign({
      _id: user._id,
      email
    }, app.config.jwt.secret, {
      expiresIn: '1h'
    });
    return this.success({
      token,
      email,
      nickname: user.nickname,
    });
  }

  async register() {
    const { ctx } = this;
    try {
      ctx.validate(UserCreateRule);
    } catch (err) {
      console.log(err);
      this.error('参数验证失败');
    }

    const { email, password, nickname } = ctx.request.body;
    console.log('注册信息', ctx.request.body);
    if (!this.checkCaptcha()) return;
    if (await this.checkEmail(email)) {
      this.error('该邮箱已存在');
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        password: md5(password + HashSalt),
      });
      if (ret._id) {
        this.success('注册成功');
      } else {
        this.error('注册失败');
      }
    }
  }

  // 检查邮箱是否存在
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
}

module.exports = UserController;
