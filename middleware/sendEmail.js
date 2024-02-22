// emailMiddleware.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

// Load email configuration from environment variables or other sources
const myEmail = process.env.EMAIL || "smartpolicewebportal@gmail.com";
const myPassword = process.env.PASSWORD || "yboi tsnl ndkd bbof";

let compiledTemplate

const sendEmail = async (email, templateName, data) => {
    // Load the HTML template based on the templateName
    // const htmlTemplate = fs.readFileSync(`C:/usman/new data base/email-templete/signUp.html`, 'utf-8');
    const htmlTemplate = fs.readFileSync(`C:/usman/new data base/email-templete/${templateName}.html`, 'utf-8');
    // const forgetTemplate = fs.readFileSync(`C:/usman/new data base/email-templete/${templateName}.html`, 'utf-8');
    // const verificationTemplate = fs.readFileSync(`C:/usman/new data base/email-templete/${templateName}.html`, 'utf-8');

    // Compile the template with EJS and data

    if (templateName === "signUp") {
        let username = data.username;
        let userpassword = data.userpassword
        compiledTemplate = ejs.compile(htmlTemplate)({ username, userpassword });
    } else if (templateName === "verifyPassoword") {
        let otpkeyData = data.otpKey
        compiledTemplate = ejs.compile(forgetTemplate)({ otpkeyData });
    }
    else if (templateName === "verificationEmail") {
        compiledTemplate = ejs.compile(verificationTemplate)();
    }
    else {
        return;

    }

    // Create and send the email using the compiled template
    const transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        // port: 587,
        // auth: {
        //     user: 'smartpolicewebportal@gmail.com',
        //     pass: 'cCsAB5dfdgzpEjAZkc'
        // }
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: myEmail,
            pass: myPassword
        }
    });

    const mailOptions = {
        from: `'Usman Bin Saad' ${myEmail}`,
        // to: email,
        to: `${email} , "smartpolicewebportal@gmail.com"`,
        subject: 'Welcome to Our App',
        html: compiledTemplate,
    };
    let info = ''
    try {
        info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Email sending error:', error);
    }
};

module.exports = { sendEmail };
