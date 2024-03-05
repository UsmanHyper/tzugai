// emailMiddleware.js
// const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();
const sendpulse = require("../utils/sendpulse_services.js")

const send_Email = async (email, templateName, data) => {

    try {
        const htmlTemplate = fs.readFileSync('C:/usman/tzugai/email-templete/subscribe.html', 'utf-8');
        compiledTemplate = ejs.compile(htmlTemplate)();


        let token_info = await sendpulse.getAccessToken();

        var encoded_html = Buffer.from(compiledTemplate, 'utf-8').toString('base64');
        var email_metadata = {
            "email": {
                html: encoded_html,
                "text": "You are registered Sucessfully.",
                "subject": "Email has been registered",
                "from": {
                    "name": "TZUGAI",
                    "email": process.env.SENDPULSE_EMAIL_SENDER_ADDRESS ?? "noreply@elmonxmail.com"
                },
                "to": [
                    {
                        // "name": `${response.full_name}`,
                        "email": email,
                    }
                ]
            },
            "access_token": token_info.access_token
        }

        let res = await sendpulse.sendEmail(email_metadata);

        return res
    } catch (error) {
        return error
    }
}



module.exports = { send_Email };
