
const sendRegistrationMail = async () => {
    const sgMail = require('@sendgrid/mail');
//    sgMail.setApiKey("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");
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: "matwolmu@gmail.com",
      from: 'matwolmu@gmail.com',
      subject: 'Amazon Price Tracker Registration',
      text: 'Your registration code: ',
      html: ' ',
    };
    try {
      console.log(msg)
      sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
    } catch (error) {
      console.log(error)
    }
    
    
}

exports.sendRegistrationMail = sendRegistrationMail


