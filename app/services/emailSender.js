const nodemailer = require('nodemailer'),
  errors = require('../errors'),
  config = require('./../../config');

const transporter = nodemailer.createTransport({
  host: config.common.mailer.host || 'smtp.mailtrap.io',
  port: config.common.mailer.port || 2525,
  auth: {
    user: config.common.mailer.auth.user,
    pass: config.common.mailer.auth.pass
  }
});

exports.sendMail = (mailOptions) => {
  return transporter.sendMail(mailOptions).catch((err) => {
    throw errors.defaultError(err.message);
  });
};
