
const sendRegistrationMail = async () => {
    const sgMail = require('@sendgrid/mail');
//    sgMail.setApiKey("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");
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: "ampritra@gmail.com",
      from: 'ampritra@gmail.com',
      subject: 'Amazon Price Tracker Registration',
      text: 'Your registration code: ',
      html: '',
    };
    try {
      sgMail.send(msg);
    } catch (error) {
      console.log("error")
    }
    
    
}

exports.sendRegistrationMail = sendRegistrationMail


