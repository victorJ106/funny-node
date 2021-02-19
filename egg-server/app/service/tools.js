'use strict';

const { Service } = require('egg');
const nodemailer = require('nodemailer');
const fse = require('fs-extra');
const path = require('path');

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

  async mergeFile(destPath, fileHash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash);
    let chunks = fse.readdirSync(chunkDir);
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    chunks = chunks.map(cp => path.resolve(chunkDir, cp));
    await this.mergeChunks(destPath, chunks, size);
  }

  async mergeChunks(destPath, chunks, size) {
    const pipeStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath);
      readStream.on('end', () => {
        fse.unlinkSync(filePath);
        resolve();
      });
      readStream.pipe(writeStream);
    });

    const promises = [];
    chunks.forEach((item, index) => {
      promises.push(pipeStream(
        item,
        fse.createWriteStream(destPath, {
          start: index * size,
          end: (index + 1) * size,
        })
      ));
    });

    await Promise.all(promises);
  }
}

module.exports = ToolsService;
