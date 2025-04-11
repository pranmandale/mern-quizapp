import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Quiz } from "../models/quiz.model.js";
import { Attempt } from "../models/attempt.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, timeLimit } = req.body;

  if (!title) throw new ApiError(400, "Title is required");

  // Parse `questions` JSON string from form-data
  let questions;
  try {
    questions = JSON.parse(req.body.questions);
  } catch (error) {
    throw new ApiError(400, "Invalid questions format");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "At least one question is required");
  }

  // Access all uploaded files
  const files = req.files || [];

  // Organize files by type and index
  const groupedQuestionImages = {};
  const groupedExplanationImages = {};

  files.forEach(file => {
    const [fieldType, index] = file.fieldname.split("_"); // Split fieldname into type and index

    if (fieldType === "questionImage") {
      if (!groupedQuestionImages[index]) groupedQuestionImages[index] = [];
      groupedQuestionImages[index].push(file);
    } else if (fieldType === "explanationImage") {
      if (!groupedExplanationImages[index])
        groupedExplanationImages[index] = [];
      groupedExplanationImages[index].push(file);
    }
  });

  // Process questions and upload images
  for (let i = 0; i < questions.length; i++) {
    questions[i].questionImages = [];
    questions[i].explanationImages = [];

    // Upload multiple question images
    if (groupedQuestionImages[i]) {
      for (let img of groupedQuestionImages[i]) {
        // console.log(img.path);

        const uploadedImg = await uploadOnCloudinary(img.path);

        //   console.log(uploadedImg);

        if (uploadedImg?.secure_url) {
          questions[i].questionImages.push(uploadedImg.secure_url);
        }
      }
    }

    // Upload multiple explanation images
    if (groupedExplanationImages[i]) {
      for (let img of groupedExplanationImages[i]) {
        const uploadedImg = await uploadOnCloudinary(img.path);
        if (uploadedImg?.secure_url) {
          questions[i].explanationImages.push(uploadedImg.secure_url);
        }
      }
    }
  }

  // Log the updated questions array for debugging
  // console.log("Updated questions:", questions);

  // Create the quiz
  const quiz = await Quiz.create({
    title,
    description,
    timeLimit,
    questions,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { quiz }, "Quiz created successfully"));
});

const getUserQuizzes = asyncHandler(async (req, res) => {
  // Get the user ID from the JWT (which is available in req.user due to the verifyJWT middleware)
  const userId = req.user._id;

  // Fetch all quizzes created by this user
  const quizzes = await Quiz.find({ createdBy: userId })
    .sort({ createdAt: -1 }) // Optional: Sort by creation date (newest first)
    .populate("createdBy", "username"); // Optional: Populate the creator's username (if you want it in the response)
  // .select('title description createdAt'); // Optional: Select specific fields to return (e.g., title, description, createdAt)

  // If no quizzes found, return a message
  if (!quizzes || quizzes.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No quizzes found"));
  }

  // Return the quizzes data
  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

// Get a single quiz by ID
const getQuizById = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  // Exclude correctAnswerIndex and explanation using select
  const quiz = await Quiz.findById(quizId)
    .select(
      "-questions.correctAnswerIndex -questions.explanation -questions.explanationImages"
    )
    .populate("createdBy", "username");

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

const editQuizById = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId).populate("createdBy", "username");

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

const updateQuiz = asyncHandler(async (req, res) => {
  const { title, description, timeLimit, questions } = req.body;

  const quiz = await Quiz.findOneAndUpdate(
    { _id: req.params.quizId, createdBy: req.user._id },
    { title, description, timeLimit, questions },
    { new: true, runValidators: true }
  );

  if (!quiz) {
    throw new ApiError(404, "Quiz not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz updated successfully"));
});

/**
 * Delete a quiz
 */
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.quizId,
    createdBy: req.user._id,
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Quiz deleted successfully"));
});

/**
 * Get leaderboard for a quiz
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Quiz.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(req.params.quizId)),
      },
    },
    {
      $lookup: {
        from: "attempts",
        localField: "_id",
        foreignField: "quizId",
        as: "attempts",
      },
    },
    { $unwind: "$attempts" },
    {
      $lookup: {
        from: "users",
        localField: "attempts.userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },

    // Sort attempts by completedAt in descending order to get the latest attempt
    { $sort: { "attempts.completedAt": -1 } },

    // Group by username to pick the latest attempt
    {
      $group: {
        _id: "$userDetails.username",
        username: { $first: "$userDetails.username" },
        score: { $first: "$attempts.score" },
        completedAt: { $first: "$attempts.completedAt" },
      },
    },

    // Sort by score in descending order
    { $sort: { score: -1 } },
  ]);

  if (leaderboard.length === 0) {
    throw new ApiError(404, "No attempts found for this quiz");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, leaderboard, "Leaderboard fetched successfully")
    );
});

const attemptQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const { quizId } = req.params;
  const userId = req.user._id;

  // Find the quiz by ID
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  // Calculate score and prepare answers with the `isCorrect` field
  let score = 0;
  const updatedAnswers = answers.map(answer => {
    const question = quiz.questions.id(answer.questionId);
    if (!question) {
      throw new ApiError(400, "Invalid question ID provided");
    }
    const isCorrect =
      question.correctAnswerIndex === answer.selectedOptionIndex;
    if (isCorrect) {
      score++; // Increment score for correct answers
    }
    return { ...answer, isCorrect };
  });

  // Create attempt record with calculated score and answers
  const attempt = new Attempt({
    userId,
    quizId,
    score,
    answers: updatedAnswers,
  });

  // Save attempt record to the database
  await attempt.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        attemptId: attempt._id,
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers: updatedAnswers.filter(answer => answer.isCorrect)
          .length,
      },
      "Quiz attempted successfully"
    )
  );
});

const getAttempts = asyncHandler(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user._id;

  // Find all attempts by this user and populate quiz details
  const attempts = await Attempt.find({ userId })
    .populate({
      path: "quizId",
      select: "title description", // Select the fields you want from quiz
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .select("score createdAt completedAt"); // Select fields you want from attempt

  if (!attempts) {
    throw new ApiError(404, "No attempts found");
  }

  // Return attempts with quiz information
  return res
    .status(200)
    .json(new ApiResponse(200, attempts, "Attempts fetched successfully"));
});

const getQuizResults = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const userId = req.user._id;

  // Find the attempt
  const attempt = await Attempt.findOne({
    _id: attemptId,
    userId: userId,
  });

  if (!attempt) {
    throw new ApiError(404, "Attempt not found");
  }

  // Find the quiz with questions
  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  // Prepare detailed results
  const detailedResults = quiz.questions.map(question => {
    const userAnswer = attempt.answers.find(
      ans => ans.questionId.toString() === question._id.toString()
    );

    return {
      questionId: question._id,
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation,
      userSelectedOption: userAnswer ? userAnswer.selectedOptionIndex : null,
      isCorrect: userAnswer ? userAnswer.isCorrect : false,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        quizTitle: quiz.title,
        score: attempt.score,
        totalQuestions: quiz.questions.length,
        results: detailedResults,
        attemptedAt: attempt.createdAt,
      },
      "Quiz results fetched successfully"
    )
  );
});

const generateQuiz = asyncHandler(async (req, res) => {
  const { title, description, difficulty, numQuestions } = req.body;

  if (!title || !description || !difficulty || !numQuestions) {
    throw new ApiError(400, "All fields are required");
  }

  const prompt = `Create a JSON quiz with the following details:\n
Title: \"${title}\"\nDescription: \"${description}\"\nDifficulty: \"${difficulty}\"\nNumber of Questions: ${numQuestions}\n
Return JSON only. Strict format:\n
{
    "title": "Sample Title",
    "description": "Sample Description",
    "timeLimit": 30,
    "questions": [
        {
            "questionText": "What is 2 + 2?",
            "options": ["1", "2", "3", "4"],
            "correctAnswerIndex": 3,
            "explanation": "2 + 2 equals 4."
        }
    ]
}`;

  try {
    const response = await fetch(process.env.GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    let textResponse = data.candidates[0].content.parts[0].text;

    // 🔹 Extract JSON from response using regex
    let jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
    let cleanedText = jsonMatch ? jsonMatch[1] : textResponse.trim();

    // 🔹 Ensure valid JSON format before parsing
    cleanedText = cleanedText.replace(/(['`])(\w+)\1:/g, '"$2":'); // Convert single-quoted keys to double-quoted

    const quiz = JSON.parse(cleanedText);

    // 🔹 Save the quiz to MongoDB
    const savedQuiz = await Quiz.create({
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, savedQuiz, "Quiz generated and saved successfully")
      );
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    throw new ApiError(500, "Failed to generate quiz. Please try again.");
  }
});

export {
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
};

// leaderbaord test
