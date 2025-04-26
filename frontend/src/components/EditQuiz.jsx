
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';

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
        credentials: "include",
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
        },
        credentials: "include",
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header and Save button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Quiz</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      {/* Quiz Info */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleChange}
          placeholder="Quiz Title"
          className="w-full p-3 border rounded"
        />
        <textarea
          name="description"
          value={quiz.description}
          onChange={handleChange}
          placeholder="Quiz Description"
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          name="timeLimit"
          value={quiz.timeLimit}
          onChange={handleChange}
          placeholder="Time Limit (in minutes)"
          className="w-full p-3 border rounded"
        />
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Question {qIndex + 1}</h2>
              <button
                onClick={() => handleRemoveQuestion(qIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter question text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="p-2 border rounded"
                />
              ))}
            </div>

            {/* Correct Answer Index */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Correct Option Index (0-3):</label>
              <input
                type="number"
                min="0"
                max="3"
                value={question.correctAnswerIndex}
                onChange={(e) => handleQuestionChange(qIndex, "correctAnswerIndex", Number(e.target.value))}
                className="w-20 ml-2 p-2 border rounded"
              />
            </div>

            {/* Explanation */}
            <textarea
              placeholder="Explanation (optional)"
              value={question.explanation}
              onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleAddQuestion}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
          Add Question
        </button>
      </div>

      {/* Footer Save/Cancel */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
