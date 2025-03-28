import nodemailer from 'nodemailer';

const sendEmail = async function (options) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define email options
  const emailOptions = {
    from: 'Huzaifa <huzaifa2@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // console.log(emailOptions);

  // Send email
  await transporter.sendMail(emailOptions);
};

export default sendEmail;
