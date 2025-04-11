"use client"

import { useState, useContext } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { ThemeContext } from "../context/ThemeContext"
import { toast } from "react-toastify"
import { LogIn, Loader2, AlertCircle } from "lucide-react"

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // Fallback to dashboard
  // console.log(location);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const show = () => {
    setShowPassword(!showPassword);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both email/username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const userData = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        // localStorage.setItem("accessToken", result.data.accessToken);
        toast.success("Logged in successfully!");

        // Redirect to the original page or dashboard
        // navigate(from, { replace: true });
        navigate('/dashboard');
      } else {
        setError(result.message || "Login failed");
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      setError("Error occurred during login");
      toast.error("Error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email or Username
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  {/* Password Input */}
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 pr-12 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                 transition-colors disabled:opacity-70"
                  />

                  {/* Show/Hide Button */}
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <button
                      type="button"
                      onClick={show}
                      className="text-gray-500 dark:text-gray-300 text-sm font-medium focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Login

