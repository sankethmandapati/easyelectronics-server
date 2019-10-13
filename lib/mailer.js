const sgMail = require('@sendgrid/mail');

module.exports = async function(to, subject, text, html) {
    try {
        sgMail.setApiKey("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");
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
