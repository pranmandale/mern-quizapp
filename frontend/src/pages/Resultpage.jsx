import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Award, BookOpen, CalendarClock, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Leaderboard from "../components/Leaderboard";

const ResultPage = () => {
  const { id } = useParams(); // Quiz ID from URL
  const [attempts, setAttempts] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/user/attempts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      // console.log(data);
  
      if (data.success && Array.isArray(data.data)) {
        const quizAttempts = data.data.filter((attempt) => attempt.quizId?._id === id);
        // console.log("Hello", quizAttempts);
  
        if (quizAttempts.length > 0) {
          setAttempts(quizAttempts);
  
          const latestAttempt = quizAttempts[0];
          if (latestAttempt.quizId?.title) {
            setQuizTitle(latestAttempt.quizId.title);
          }
  
          fetchQuizDetails(id, latestAttempt);
        }
      } else {
        toast.error(data.message || "Failed to fetch attempts.");
      }
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };
  

  const fetchQuizDetails = async (quizId, latestAttempt) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.data.questions);

        // Use the latest attempt's score
        const total = latestAttempt?.score || 0;
        setTotalScore(total);

        // Calculate percentage correctly
        const maxScore = data.data.questions.length;
        const calculatedPercentage = maxScore > 0 ? ((total / maxScore) * 100).toFixed(2) : 0;
        setPercentage(calculatedPercentage);

        // Determine pass/fail status
        setStatus(calculatedPercentage >= 50 ? "passed" : "failed");
      }
    } catch (error) {
      toast.error("Error fetching quiz details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Attempts Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find any attempts for this quiz. Try taking the quiz first.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Award className="h-6 w-6 text-blue-500" />
        Quiz Results
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{quizTitle}</h2>

          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Your Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalScore} / {questions.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {percentage}% correct answers
              </div>
            </div>

            <div className={`flex-1 rounded-lg p-4 ${status === "passed"
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20"
              }`}>
              <div className={`text-sm font-medium ${status === "passed"
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
                } mb-1`}>
                Result
              </div>
              <div className="flex items-center gap-2">
                {status === "passed" ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Failed</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {status === "passed" ? "Congratulations!" : "Try again to improve your score"}
              </div>
            </div>
          </div>


          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-start">
            <button
              onClick={() => navigate(`/explanation/${id}`)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              View Explanations
            </button>
          </div>

          <Leaderboard/>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-blue-500" />
              Attempt History
            </h3>

            <div className="space-y-3">
              {attempts.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Attempt {index + 1}</span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(attempt.completedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                    Score: {attempt.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ResultPage;
