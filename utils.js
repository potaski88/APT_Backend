
const sendRegistrationMail = async () => {
    const sgMail = require('@sendgrid/mail');

    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: "matwolmu@gmail.com",
      from: 'ampritra@gmail.com',
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


