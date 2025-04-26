
"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  HelpCircle
} from "lucide-react";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

 

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && started) {
      handleSubmit();
    }
  }, [timeLeft, started]);

 

  const fetchQuiz = async () => {
    try {
    
    const token = Cookies.get("accessToken");
    

   
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    
    if (data.success) {
      
      setQuiz(data.data);
      
    
      setTimeLeft(data.data.timeLimit * 60);
    } else {
      toast.error("Failed to fetch quiz.");
    }
  } catch (error) {
    toast.error("An error occurred while fetching the quiz.");
  } finally {
    setLoading(false);
  }
};



  const startQuiz = () => {
    setStarted(true);

    // ✅ Save start status
    localStorage.setItem(`quizStarted_${id}`, "true");

    // ✅ Save start timestamp (optional)
    localStorage.setItem(`quizStartTime_${id}`, Date.now().toString());
  };

  



  const handleOptionSelect = (questionId, optionIndex) => {
    

    if (!id) return;

    const updatedAnswers = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(updatedAnswers);

    // Set question status to "attempted"
    const updatedStatus = { ...questionStatus, [questionId]: "attempted" };
    setQuestionStatus(updatedStatus);

    

    // Save updatedAnswers to Cookies and localStorage
    Cookies.set(`userSelections_${id}`, JSON.stringify(updatedAnswers), { expires: 1 });

    // Save to localStorage
    localStorage.setItem(`userSelections_${id}`, JSON.stringify(updatedAnswers));

   
  };





  const handleSubmit = async () => {
    if (!showConfirmSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    setShowConfirmSubmit(false);

    try {
      

      // Get the token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        console.error("No token found in localStorage");
        return;
      }
      

      // Prepare updated answers
      let updatedAnswers = selectedAnswers;
      const cookieData = Cookies.get(`userSelections_${id}`);
      if ((!updatedAnswers || Object.keys(updatedAnswers).length === 0) && cookieData) {
        updatedAnswers = JSON.parse(cookieData);
      }

      const answers = Object.entries(updatedAnswers || {}).map(
        ([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptionIndex,
        })
      );

      // Call API with token in Authorization header
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}/attempt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Ensure the token is included
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify({ answers }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Quiz submitted successfully!");

        // Clean up localStorage after successful submission
        localStorage.removeItem(`quizSelectedAnswers_${id}`);
        localStorage.removeItem(`quizStarted_${id}`);
        localStorage.removeItem(`quizStartTime_${id}`);

        // Clean up cookies
        Cookies.remove(`userSelections_${id}`);

        navigate(`/result/${id}`);
      } else {
        toast.error(data.message || "Failed to submit quiz.");
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error while submitting quiz:", error);
      toast.error("An error occurred while submitting the quiz.");
    }
  };


  const cancelSubmit = () => {
    setShowConfirmSubmit(false);
  };

  const navigateQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


 


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started) return;

      if (e.key === "ArrowRight") goToNextQuestion();
      else if (e.key === "ArrowLeft") goToPreviousQuestion();
      else if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < quiz.questions.length) navigateQuestion(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, currentQuestionIndex, quiz]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The quiz you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const attemptedCount = Object.keys(questionStatus).length;
  const progressPercentage = (attemptedCount / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {!started ? (
        <div className="flex justify-center items-center min-h-screen p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{quiz.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center">
                  <HelpCircle className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                    <p className="font-semibold">{quiz.questions.length}</p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-center">
                  <Clock className="h-6 w-6 text-amber-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time Limit</p>
                    <p className="font-semibold">{quiz.timeLimit} minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-3">Quiz Rules:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mr-2 justify-center items-center">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <span>No tab switching (You will be warned!)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mr-2 justify-center items-center">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <span>No screenshots allowed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-500 mr-2 justify-center items-center">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span>Quiz auto-submits on timeout</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-500 mr-2 justify-center items-center">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    <span>Attempted questions will be highlighted in the navigation</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg font-semibold">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                  {attemptedCount} of {quiz.questions.length} answered
                </span>
                <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Submit Quiz
              </button>
            </div>
          </div>

          {/* Main Quiz Body */}
          <div className="flex-grow px-4 py-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {/* Question Navigation */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateQuestion(index)}
                    className={`p-3 rounded-full text-sm font-semibold ${questionStatus[quiz.questions[index].id] === "attempted"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

             
                
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  {/* Displaying Current Question */}
                  {quiz && quiz.questions && quiz.questions.length > 0 && (
                    <>
                      <h2 className="text-xl font-semibold mb-4">
                        {currentQuestionIndex + 1}. {quiz.questions[currentQuestionIndex].questionText}
                      </h2>


                      <div className="space-y-4">
                        {/* Mapping through the options of the current question */}
                        {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center cursor-pointer p-3 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedAnswers[quiz.questions[currentQuestionIndex].id] === index
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                              }`}
                            // onClick={() => handleOptionSelect(quiz.questions[currentQuestionIndex]._id, index)}

                            onClick={() => handleOptionSelect(quiz.questions[currentQuestionIndex]._id, index)}

                          >
                            <input
                              type="radio"
                              name={`question-${quiz.questions[currentQuestionIndex]._id}`}
                              checked={selectedAnswers[quiz.questions[currentQuestionIndex]._id] === index}
                              onChange={() => { }}
                              className="mr-4"
                            />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>


              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded-lg"
                >
                  <ArrowLeft className="mr-2" />
                  Previous
                </button>
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded-lg"
                >
                  Next
                  <ArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Submit Confirmation */}
      {showConfirmSubmit && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={cancelSubmit}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Are you sure you want to submit the quiz?
            </h3>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={cancelSubmit}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;
