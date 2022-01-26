import sgMail from '@sendgrid/mail'
// import ejs from 'ejs';
// import path from 'path';
require('dotenv').config();

sgMail.setApiKey(process.env.TEST_API_KEY_SENDGRID)

const sendResetEmail = async (mailOptions)=> {
    // const template = '../public/template/signup.ejs'
    // const emailBody = await ejs.renderFile(path.join(__dirname, template), {email,names})
    sgMail
    .send(mailOptions)
    .then(() =>{
        console.log('the email has been sent')
    })
    .catch((error) =>{
        console.error(error)
    })

//   try {
  //      const sendmail = sgMail.send(mailOption)

    //    return sendmail
    //} catch (error) {
      //  return error;
    }
//}
export default  sendResetEmail;