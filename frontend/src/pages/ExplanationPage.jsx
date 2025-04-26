

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, ChevronLeft, Info, CheckCircle } from "lucide-react"

// Helper function to get a specific cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ExplanationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [userSelections, setUserSelections] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")




  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No access token found.");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/edit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz details: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data.questions?.length > 0) {
          setQuestions(data.data.questions);
        } else {
          setError("No questions available for this quiz.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    //  Retrieve user selections from correct key
    const savedSelections = JSON.parse(localStorage.getItem(`userSelections_${id}`));
    if (savedSelections) {
      setUserSelections(savedSelections);
    } else {
      console.log("No saved selections found for quiz id:", id);
    }

    fetchQuizDetails();
  }, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading explanations...</p>
      </div>
    )
  }

  if (error || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error || "No Questions Available"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const userSelectedIndex = userSelections[currentQuestion._id]


  
  const progress = ((currentIndex + 1) / questions.length) * 100


  return (
   
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <span className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-md mb-3">
          Question {currentIndex + 1}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {currentQuestion?.questionText}
        </h2>

        {/* Your Answer Section with conditional background color */}
        <div
          className={`p-4 mb-4 rounded-lg ${userSelectedIndex === currentQuestion.correctAnswerIndex
              ? 'bg-green-100 dark:bg-green-900/20'
              : 'bg-red-100 dark:bg-red-900/20'
            }`}
        >
          <p className="text-sm text-gray-900 dark:text-white font-medium">Your Answer:</p>
          <p className="text-lg text-gray-900 dark:text-white">
            {currentQuestion?.options?.[userSelectedIndex]}
            {console.log(currentQuestion?.options?.[userSelectedIndex])}
          </p>
        </div>

        {/* Correct Answer Section */}
        <div className="flex items-start space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <CheckCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Correct Answer:</p>
            <p>{currentQuestion?.options?.[currentQuestion.correctAnswerIndex]}</p>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Explanation</h3>
          <p className="text-gray-700 dark:text-gray-300">{currentQuestion?.explanation}</p>

          {currentQuestion?.explanationImages?.length > 0 && (
            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <img
                src={currentQuestion.explanationImages[0] || "/placeholder.svg"}
                alt="Explanation Image"
                className="w-full max-h-80 object-contain"
              />
            </div>
          )}
        </div>


         <div className="flex justify-between">
           <button
             onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
             disabled={currentIndex === 0}
             className="flex items-center px-5 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
           >
             <ArrowLeft className="h-4 w-4 mr-2" />
             Previous
           </button>

           <button
             onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
             disabled={currentIndex === questions.length - 1}
             className="flex items-center px-5 py-2.5 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
           >
             Next
             <ArrowRight className="h-4 w-4 ml-2" />
           </button>
         </div> 
        
      </div>
      
    </div>

  )
}

export default ExplanationPage
