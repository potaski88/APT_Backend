
const sendRegistrationMail = async () => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey("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");
//    sgMail.setApiKey(process.env.SENDGRID_KEY);
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


