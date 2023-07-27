const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  service: 'gmail',
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
  const mailOptions = {
    from: EMAIL_USER,
    ...data,
  };
  return transport.sendMail(mailOptions);
};

module.exports = sendEmail;
