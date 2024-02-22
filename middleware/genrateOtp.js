const otpGenerator = require('otp-generator')

const generateOTP = () => {
    return otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });

};

module.exports = { generateOTP };

