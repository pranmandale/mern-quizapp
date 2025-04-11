import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Plus, Trash2, Clock, HelpCircle, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimit: 0,
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/edit/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuiz(data.data);
      } else {
        toast.error("Failed to fetch quiz.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    if (quiz.questions.length <= 1) {
      toast.error("Quiz must have at least one question");
      return;
    }
    
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    // Validate quiz data

    // console.log(quiz)
    if (!quiz.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }
    
    if (quiz.questions.some(q => !q.questionText.trim())) {
      toast.error("All questions must have text");
      return;
    }
    
    if (quiz.questions.some(q => q.options.some(opt => !opt.trim()))) {
      toast.error("All options must have text");
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(quiz),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Quiz updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Failed to update quiz.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the quiz.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Quiz</h1>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quiz Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={quiz.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={quiz.description}
                onChange={handleChange}
                placeholder="Enter quiz description"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Limit (minutes)
              </label>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  min="1"
                  // max="180"
                  value={quiz.timeLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Questions
          </h2>
       
        </div>
        
        <div className="space-y-6">
          {quiz.questions.map((question, qIndex) => (
            <div 
              key={qIndex} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Question {qIndex + 1}</h3>
                  
                  <button
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor={`question-${qIndex}`} 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Question Text
                    </label>
                    <input
                      id={`question-${qIndex}`}
                      type="text"
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                      placeholder="Enter question text"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Answer Options
                    </p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            id={`option-${qIndex}-${oIndex}`}
                            type="radio"
                            name={`correctAnswer-${qIndex}`}
                            checked={question.correctAnswerIndex === oIndex}
                            onChange={() => handleQuestionChange(qIndex, "correctAnswerIndex", oIndex)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor={`explanation-${qIndex}`} 
                      // block css property removed
                      className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
                    >
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Explanation
                    </label>
                    <textarea
                      id={`explanation-${qIndex}`}
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                      placeholder="Explain the correct answer"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

         
      <button
            onClick={handleAddQuestion}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
