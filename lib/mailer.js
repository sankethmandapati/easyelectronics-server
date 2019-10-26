const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_KEY;

module.exports = async function(to, subject, text, html) {
    try {
        sgMail.setApiKey(apiKey);
        const msg = {
          to,
          from: 'chatrbot@gmail.com',
          subject,
          text,
          html
        };
        await sgMail.send(msg);
        return "Email sent successfully";
    } catch(err) {
        console.log("Error oin sending emmail: ", err);
        throw err;
    }
}
