// import nodemailer from "nodemailer";

// export const sendEmail = async (email, otp) => {

//     const transporter = nodemailer.createTransport({
//         service:"gmail",
//         auth:{
//             user:process.env.EMAIL,
//             pass:process.env.EMAIL_PASS
//         }
//     })

//     await transporter.sendMail({
//         from:process.env.EMAIL,
//         to:email,
//         subject:"Think OTP Verification",
//         html:`<h2>Thank You for register. Your one time password is ${otp}</h2>`
//     })
// }





import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Think App" <${process.env.EMAIL}>`,
      to: email,
      subject: "Think OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>OTP Verification</h2>
          <p>Thank you for registering.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    return true;

  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};