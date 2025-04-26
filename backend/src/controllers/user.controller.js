import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "./sendEmail.js";

import { sendToken } from "./token.js";

import crypto from "crypto";



// Generate access and refresh tokens for user
const generateTokens = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

// User registration
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some(field => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }


  // verification code generated
  const { verificationCode, verificationCodeExpire } = generateVerificationCode();


  req.session.tempUser = {
    fullName,
    email,
    username,
    password,
    verificationCode,
    verificationCodeExpire,
  };

  sendVerificationCode(verificationCode, email, res);
  console.log("verification email sent to your email")


  return res.status(200).json({
    success: true,
    message: "Verification code sent to your email",
  });

     
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// User logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // Important for cross-origin cookies
    path: "/", // Clear from all routes
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.isPasswordCorrect(oldPassword))) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user data fetched")); // changed req.user to user
});


// Update user profile
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!(fullName || email)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Fetch user's quiz history
const getUserQuizHistory = asyncHandler(async (req, res) => {
  const userQuizHistory = await User.aggregate([
    { $match: { _id: req.user._id } },
    {
      $lookup: {
        from: "attempts",
        localField: "_id",
        foreignField: "user",
        as: "quizHistory",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userQuizHistory[0]?.quizHistory || [],
        "Quiz history fetched successfully"
      )
    );
});




function generateVerificationCode() {
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  return {
    verificationCode,
    verificationCodeExpire: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
  };
}




function generateEmailTemplate(verificationCode) {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <div style="text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for signing up. Please use the verification code below to complete your registration:</p>
                    <div style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; border-radius: 4px; background: #f9fff9;">
                        ${verificationCode}
                    </div>
                </div>
                <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px;">
                    <p>If you did not request this code, you can ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}




const sendVerificationCode = async (verificationCode, email) => {
  try {
    const message = generateEmailTemplate(verificationCode);

    // ✅ Fixed: Correct key names used here
    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      html: message,
    });

    console.log("✅ Verification email sent to:", email);

  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Verification code failed to send");
  }
};







const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  try {
    const tempUser = req.session.tempUser;

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "No temporary user found. Please start the process again."
      });
    }

    const {
      verificationCode,
      verificationCodeExpire,
      fullName,
      username,
      password,
      email
    } = tempUser;

    if (Number(otp) !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!"
      });
    }

    const currentTime = Date.now();
    if (currentTime > verificationCodeExpire) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired!"
      });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      accountVerified: true
    });

    req.session.tempUser = null; // Clear session

    await sendToken(user, 200, "User registered and verified successfully!", res);

  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});





const forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log("📩 Password reset requested for email:", email);

  // ✅ Validate email early and stop execution if invalid
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    console.log("❌ Invalid or missing email in request.");
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
        <h2>Hello ${user.fullName},</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link will expire in 10 minutes:</p>
        <a href="${resetUrl}">Reset Password</a>
    `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    console.log("📧 Email sent to", user.email);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("❌ Failed to send email:", err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ message: "Failed to send reset email. Try again later." });
  }
};





const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword || password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match or missing.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password has been reset successfully." });
});




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  getUserQuizHistory,
  verifyOTP,
  forgotPassword,
  resetPassword
};
