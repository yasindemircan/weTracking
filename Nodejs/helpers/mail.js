const nodemailer = require("nodemailer");
const config = require('../key');

  module.exports = function(to,text){
    console.log("text:",text)
    if(!config.mail || !config.password)
        return undefined;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: config.mail, 
        pass: config.password, 
      },
    });

    const info ={
        from: `${config.mail}`, // sender address
        to: to, // list of receivers
        subject: "We Tracking", // Subject line
        text: `${text}`, // plain text body
       // html: "<b>Hello world?</b>", // html body
      };

      return new Promise((resolve, reject)=> {
           transporter.sendMail(info,(error,succes) => {
           error ? reject(error): resolve(succes);

      });
    });
}
        