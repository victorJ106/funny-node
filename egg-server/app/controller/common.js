'use strict';

const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');
// const fse = require('fs-extra');

module.exports = class CommonController extends BaseController {

  async captcha() {
    console.log('captcha============');
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      color: true,
      background: '#dddddd',
      width: 100,
      height: 40,
      noise: 3,
    });
    console.log(`captcha => ${captcha.text}`);
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }

  async sendMailCode() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().substring(2, 6);
    ctx.session.emailCode = code;
    console.log('================', code);
    const subject = '注册验证码';
    const text = '';
    const html = `<h2>复制此验证码进行验证，${code}</h2>`;
    const res = await this.service.tools.sendEmail(email, subject, text, html);
    if (res) {
      this.success('发送成功');
    } else {
      this.error('发送失败');
    }
  }
};
