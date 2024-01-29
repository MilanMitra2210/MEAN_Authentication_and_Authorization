import bcrypt from 'bcrypt';
import NodeMailer from 'nodemailer';
import jwt from "jsonwebtoken";
import twilio from 'twilio';
import otpModel from '../models/tokenModel';
import tokenModel from '../models/tokenModel';

// Configure nodemailer for sending emails
const transporter = NodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'milan.75way@gmail.com',
    pass: 'gjygvjgshfeclqlx',
  },
});

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error; // Optionally rethrow the error or handle it as needed
  }
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const isValidEmail = async (email: string): Promise<boolean> => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const verifyPhoneNumberAndMail = async (name: string, email: string, phone: string) => {

  const emailBody = `<div class="container">
  <p>Hello ${name},</p>
  <p>Thank you for signing up. To complete your registration, please verify your email and phone number by clicking the following link</p>
  <a href= "http://localhost:8080/api/v1/auth/sendotp"}">click here</a>
  <p>If you didn't sign up for an account, please ignore this email.</p>
  <div class="footer">
    <p>This email was sent by authentication team</p>
  </div>
</div>`

  // Simulate sending an email
  const mailOptions = {
    from: 'milan.75way@gmail.com',
    to: email,
    subject: 'Email and Phone Verification',
    text: `Verifying mail sent successfully`,
    html: emailBody,
  };

  //sending mail
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

const sendVerificationMail = async (user: any) => {

  const jwt_secret_key: string = process.env.JWT_OTP_SECRET || "";
  const token = await jwt.sign({_id: user._id }, jwt_secret_key, {
    expiresIn: 300,
  });
  // Replace the template placeholder with the actual OTP
  const emailBody = `
<div class="container">
  <p>Hello ${user.name},</p>
  <p>Thank you for signing up. To complete your registration, please verify your email by clicking the following link</p>
  <a href = http://localhost:8080/api/v1/auth/verifyemail/${token}>click here</a>
  <p >This link is valid for 5 minutes only</p>
  <p>If you didn't sign up for an account, please ignore this email.</p>
  <div class="footer">
    <p>This email was sent by the authentication team</p>
  </div>
</div>
`;

  // Simulate sending an email
  const mailOptions = {
    from: 'milan.75way@gmail.com',
    to: user.email,
    subject: 'Email Verification',
    text: `Verifying mail sent successfully`,
    html: emailBody,
  };

  //sending mail
  if(!user.isMailVerified){
    const info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //credentials
  const sid: string = process.env.TWILIIO_ACCOUNT_SID || "";
  const authToken: string = process.env.TWILIIO_AUTH_TOKEN || "";
  const twilioPhone: string = process.env.TWILIIO_PHONE_NO || "";
  
  const client = twilio(sid, authToken);

  if(!user.isPhoneVerified){
    try {
      // Send SMS using Twilio API
      const result = await client.messages.create({
        body: `Here is your OTP ${otp} for verify your phone number. This is valid for 5minutes only.`,
        to: `+91 ${user.phone}`,
        from: twilioPhone,
      });
      
      const existingOTP = await otpModel.findById(user._id);

      //save to db
      if(existingOTP){
        existingOTP.token = otp;
        existingOTP.save();
      }else{
        
        await new tokenModel({
          _id: user._id,
          otp
        }).save();
      }
      
      const hashedotp = await hashPassword(otp); //will be used in restapi of verifying otp
      const updated = hashedotp.replace(/\//g, '@#$%^&*');
      console.log("Use this hashed OTP, send it via params in REST API and Verify", updated);

      
  
      console.log(`SMS sent successfully. SID: ${result.sid}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

}

const sendEmail = async (user: any,  token: string) => {

  const emailBody = `
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <p>Dear ${user.firstName} ${user.lastName}, </p>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); padding: 30px;">
      <h2 style="text-align: center; color: #333333;">Password Reset</h2>
      <p style="text-align: center; color: #666666;">We have received a request to reset your password for your account in MEAN Auth. Please click the link below to reset your password:</p>
      <p style="text-align: center; margin-top: 30px;"><a href=${process.env.LIVE_URL}/reset/${token} style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p style="text-align: center; color: #666666; margin-top: 20px;">Please note that this link is only valid for 5mins. If you did not request a password reset, please disregard this message.</p>
    </div>
  
  </body>
  </html>
  `;


  const mailOptions = {
    from: 'milan.75way@gmail.com',
    to: user.email,
    subject: 'Reset Password',
    text: `Reset Password mail sent successfully`,
    html: emailBody,
  };

  const info = await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      throw error;
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

export { hashPassword, comparePassword, isValidEmail, verifyPhoneNumberAndMail, sendVerificationMail, sendEmail };
