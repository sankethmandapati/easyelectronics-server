const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_KEY || "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";

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
