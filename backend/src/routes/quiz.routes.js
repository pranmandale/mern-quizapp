import express from "express";
import {
  createQuiz,
  getUserQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getLeaderboard,
  attemptQuiz,
  getAttempts,
  getQuizResults,
  editQuizById,
  generateQuiz,
} from "../controllers/quiz.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();



// Attempts
router.get("/user/attempts", verifyJWT, getAttempts);

// Create + Generate
router.post("/create", verifyJWT, upload.any(), createQuiz);
router.get("/my-quizzes", verifyJWT, getUserQuizzes);
router.post("/generate-quiz", verifyJWT, generateQuiz);

// Specific parameter routes (put first)
router.get("/:quizId/leaderboard", verifyJWT, getLeaderboard);
router.post("/:quizId/attempt", verifyJWT, attemptQuiz);
router.get("/attempt/:attemptId/results", verifyJWT, getQuizResults);
router.get("/edit/:quizId", verifyJWT, editQuizById);
router.patch("/:quizId/update", verifyJWT, updateQuiz);
router.delete("/:quizId/delete", verifyJWT, deleteQuiz);

// Dynamic quiz fetch (put last)
router.get("/:quizId", verifyJWT, getQuizById);


export default router;
