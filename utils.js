const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ampritra@gmail.com',
    pass: 'matthias88'
  }
});



const sendRegistrationMail = async (email, code) => {
    const mailOptions = {
        from: 'ampritra@gmail.com',
        to: email,
        subject: "Amazon Price Tracker Registration",
        text: 'Your registration code: ' + code,
      };

   transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    }); 

}

exports.sendRegistrationMail = sendRegistrationMail


