
const sendRegistrationMail = async (email, code) => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey("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");
//    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: "matwolmu@gmail.com",
      from: 'ampritra@gmail.com',
      subject: 'Amazon Price Tracker Registration',
      text: 'Your registration code: ' + code,
      html: '',
    };
    sgMail.send(msg);
    
}

exports.sendRegistrationMail = sendRegistrationMail


