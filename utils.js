
const sendRegistrationMail = async (email, code) => {
 console.log("sending");
  const target = "http://potaski.space/api/"
  try {
       axios.get(target
        /*, {
          email: "matwolmu@gmail.com",
          code: code
        
        }
        */)
        .then((response) => {
          console.log(response.data);
        }, (error) => {
          console.log(error);
        });
  } catch (error) {

  }











  /*
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'ampritra@gmail.com',
      pass: 'matthias88'
  }
  });

  var mailOptions = {
  from: 'ampritra@gmail.com',
  to: 'matwolmu@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
      console.log(error);
  } else {
      console.log('Email sent: ' + info.response);
      res.send("OK")
  }
  });
    */
    
}

exports.sendRegistrationMail = sendRegistrationMail


