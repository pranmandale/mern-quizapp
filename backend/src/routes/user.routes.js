import express from "express";
import { registerUser, loginUser, logoutUser, updateAccountDetails, refreshAccessToken, getCurrentUser, changePassword, getUserQuizHistory, verifyOTP, forgotPassword, resetPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changePassword);
router.get("/quiz-history", verifyJWT, getUserQuizHistory)

router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);


router.put("/reset-password/:token", resetPassword);





export default router;
