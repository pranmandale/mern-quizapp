import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from './Layout/AppLayout';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashboardPage';
import Resultpage from './pages/Resultpage';
import ExplanationPage from './pages/ExplanationPage';
import CreateQuizPage from './pages/CreateQuizPage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import Historypage from './pages/HistoryPage';
import LeaderBoardPage from './pages/LeaderBoardPage';
import { ToastContainer, toast } from 'react-toastify';
import Edit from './pages/Edit';
import ProfilePage from './pages/ProfilePage';
import JoinQuizPage from './pages/JoinQuizPage';
import HomePage from './pages/HomePage';
import AiQuizPage from './pages/AiQuizPage';
import { jwtDecode } from 'jwt-decode';
import ForgotPassword from './components/ForgotPassword';
import Verification from './components/Verification';
import ResetPassword from './components/ResetPassword ';


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      
      { path: '/edit-quiz/:id', element: <Edit /> },
      { path: '/result/:id', element: <ProtectedRoute><Resultpage /></ProtectedRoute> },
      { path: '/leaderboard/:id', element: <ProtectedRoute><LeaderBoardPage /></ProtectedRoute> },
      { path: '/explanation/:id', element: <ProtectedRoute><ExplanationPage /></ProtectedRoute> },
      { path: '/create-quiz', element: <ProtectedRoute><CreateQuizPage /></ProtectedRoute> },
      { path: '/history', element: <ProtectedRoute><Historypage /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: '/join-quiz', element: <ProtectedRoute><JoinQuizPage /></ProtectedRoute> },
      { path: '/ai-quiz', element: <ProtectedRoute><AiQuizPage /></ProtectedRoute> },
    ]
  },
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/attempt-quiz/:id', element: <ProtectedRoute><AttemptQuizPage /></ProtectedRoute> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: "/verification", element: <Verification /> },
  { path: "/reset-password/:token", element: <ResetPassword/>},
]);

// ✅ Refresh Token Function
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to refresh token');
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.data.accessToken);
    console.log('Access token refreshed!');
  } catch (error) {
    console.error(error.message);
    toast.error(error.message);
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }
};

// ✅ Check Token Expiry
const isTokenExpiredOrExpiringSoon = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedToken.exp - currentTime;

    // If token expires in less than 5 minutes, consider it "expiring soon"
    return timeLeft <= 300; // 300 seconds = 5 minutes
  } catch (error) {
    return true; // If token is invalid, consider it expired
  }
};

const App = () => {
  useEffect(() => {
    // ✅ Token Refresh Logic Every 15 Minutes
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken && isTokenExpiredOrExpiringSoon(accessToken)) {
        console.log('Access token is expired or expiring soon. Attempting to refresh...');
        refreshAccessToken();
      }
    }, 15 * 60 * 1000); // Every 15 Minutes

    return () => clearInterval(interval); // Clean Up
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
