const cron = require("node-cron");
const UserOTPVerification = require("../models/otpVerification.js");

const runCron = cron.schedule("20 * * * *", async () => {
    // const runCron = cron.schedule("3 * * * *", async () => {
    try {
        const currentTime = Date.now();

        const delOTP = await UserOTPVerification.deleteMany({ expireAt: { $lt: currentTime } });
        if (delOTP.deletedCount) {
            console.log("Expired OTPs deleted successfully");
        } else {
            console.log("No OTP Available to Delete");
        }

    } catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
});

module.exports = { runCron };