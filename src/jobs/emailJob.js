const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = (agenda) => {
    agenda.define("send verification email", async (job) => {
        const { user } = job.attrs.data;

        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET || "thisismycourse",
            { expiresIn: "1d" }
        );

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #4CAF50;">Welcome to Task Manager!</h2>
                    <p>Thank you for signing up. Please verify your email address by clicking the button below.</p>
                    <a href="${process.env.APP_URL}/verify/${token}" 
                       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                              text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                       Verify Email
                    </a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Verification email sent to ${user.email}`);
    });
};
