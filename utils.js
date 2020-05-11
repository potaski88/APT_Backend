const nodemailer = require('nodemailer');


const sendRegistrationMail = async (email, code) => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: email,
      from: 'ampritra@gmail.com',
      subject: 'Amazon Price Tracker Registration',
      text: 'Your registration code: ' + code,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
    
}

exports.sendRegistrationMail = sendRegistrationMail


