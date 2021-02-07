'use strict';

const { Service } = require('egg');
const nodemailer = require('nodemailer');

const userEmail = 'victorj818@163.com';

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: userEmail,
    pass: 'SGJHQBAAKECZAZGJ',
  },
});

class ToolsService extends Service {

  async sendEmail(email, subject, text, html) {
    try {
      console.log(email);
      await transporter.sendMail({
        from: userEmail,
        to: email,
        subject,
        text,
        html,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = ToolsService;
