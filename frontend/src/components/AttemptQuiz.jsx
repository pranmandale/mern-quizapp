"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, HelpCircle } from "lucide-react"

const AttemptQuiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [questionStatus, setQuestionStatus] = useState({})
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [])

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && started) {
      handleSubmit()
    }
  }, [timeLeft, started])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      const data = await response.json()
      if (data.success) {
        setQuiz(data.data)
        setTimeLeft(data.data.timeLimit * 60)
      } else {
        toast.error("Failed to fetch quiz.")
      }
    } catch (error) {
      toast.error("An error occurred while fetching the quiz.")
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setStarted(true)
  }

  const handleOptionSelect = (questionId, optionIndex) => {
    const updatedAnswers = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(updatedAnswers);
    setQuestionStatus({ ...questionStatus, [questionId]: "attempted" });
    localStorage.setItem(`userSelections_${id}`, JSON.stringify(updatedAnswers));
  }

  const handleSubmit = async () => {
    if (showConfirmSubmit) {
      setShowConfirmSubmit(false)

      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      }))

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}/attempt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ answers }),
        })

        const data = await response.json()
        if (data.success) {
          toast.success("Quiz submitted successfully!")
          navigate(`/result/${id}`)
        } else {
          toast.error("Failed to submit quiz.")
        }
      } catch (error) {
        toast.error("An error occurred while submitting the quiz.")
      }
    } else {
      setShowConfirmSubmit(true)
    }
  }

  const cancelSubmit = () => {
    setShowConfirmSubmit(false)
  }

  const navigateQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started) return

      if (e.key === "ArrowRight") {
        goToNextQuestion()
      } else if (e.key === "ArrowLeft") {
        goToPreviousQuestion()
      } else if (e.key >= "1" && e.key <= "9") {
        const index = Number.parseInt(e.key) - 1
        if (index < quiz.questions.length) {
          navigateQuestion(index)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [started, currentQuestionIndex, quiz])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Not Found</h2>
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
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const attemptedCount = Object.keys(questionStatus).length
  const progressPercentage = (attemptedCount / quiz.questions.length) * 100

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
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mr-2">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <span>No tab switching (You will be warned!)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mr-2">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <span>No screenshots allowed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-500 mr-2">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span>Quiz auto-submits on timeout</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-500 mr-2">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    <span>Attempted questions will be highlighted in the navigation</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header with timer and progress */}
          <div className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-mono text-lg font-semibold">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                  </span>
                </div>
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-200"
              >
                Submit Quiz
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full p-4 gap-4">
            {/* Question Navigation Panel - Sidebar on desktop, bottom bar on mobile */}
            <div className="md:w-1/4 order-2 md:order-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:sticky md:top-20 md:h-fit">
              <h3 className="text-lg font-semibold mb-3">Questions</h3>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {quiz.questions.map((question, index) => (
                  <button
                    key={question._id}
                    onClick={() => navigateQuestion(index)}
                    className={`
                      relative p-3 rounded-lg font-medium transition-all duration-200
                      ${
                        currentQuestionIndex === index
                          ? "bg-blue-500 text-white"
                          : questionStatus[question._id]
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }
                    `}
                    aria-label={`Question ${index + 1}`}
                  >
                    {index + 1}
                    {questionStatus[question._id] && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="inline-block h-3 w-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mr-1"></span>
                    <span>Attempted</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block h-3 w-3 bg-blue-500 rounded-lg mr-1"></span>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block h-3 w-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-1"></span>
                    <span>Unattempted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Question Section */}
            <div className="md:w-3/4 order-1 md:order-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>

                <div className="flex md:hidden items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                    {attemptedCount}/{quiz.questions.length}
                  </span>
                  <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h2>

              {currentQuestion.questionImages?.length > 0 && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.questionImages[0] || "/placeholder.svg"}
                    alt="Question"
                    className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(currentQuestion._id, index)}
                    className={`
                      relative rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer
                      transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700
                      ${
                        selectedAnswers[currentQuestion._id] === index
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                          : "bg-white dark:bg-gray-800"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div
                        className={`
                        flex items-center justify-center h-6 w-6 rounded-full border mr-3
                        ${
                          selectedAnswers[currentQuestion._id] === index
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`
                    flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                    ${
                      currentQuestionIndex === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }
                  `}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>

                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                  className={`
                    flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                    ${
                      currentQuestionIndex === quiz.questions.length - 1
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }
                  `}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in duration-200">
            <h3 className="text-xl font-bold mb-2">Submit Quiz?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have answered {attemptedCount} out of {quiz.questions.length} questions.
              {attemptedCount < quiz.questions.length && " Some questions are still unanswered."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttemptQuiz

