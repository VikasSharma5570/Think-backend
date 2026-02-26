import User from "../models/User.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import { sendEmail } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate otp
    const otp = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Signup error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Verify email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.token = token;
    await user.save();

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      token,
      user: safeUser,
    });

    // res.status(200).json({
    //   token,
    //   user,
    // });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.token = null;
    await user.save();

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Logout failed",
    });
  }
};
