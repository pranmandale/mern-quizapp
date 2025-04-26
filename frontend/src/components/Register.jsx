
"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ThemeContext } from "../context/ThemeContext"
import { toast } from "react-toastify"
import { UserPlus, Mail, User, Lock, Loader2, Check } from "lucide-react"

const Register = () => {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const fullNameRef = useRef(null)

  useEffect(() => {
    fullNameRef.current?.focus()
  }, [])

  const togglePasswordVisibility = () => setShowPassword(prev => !prev)

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const { fullName, username, email, password } = userData

    if (!fullName.trim()) newErrors.fullName = "Full name is required"
    if (!username.trim()) newErrors.username = "Username is required"
    else if (username.length < 3) newErrors.username = "Username must be at least 3 characters"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password.trim()) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setSuccessMessage("")

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem("accessToken", result.data.accessToken);
        setSuccessMessage("Verification email sent! Redirecting...")
        toast.success("📧 Verification email sent!")
        setTimeout(() => navigate("/verification"), 2500)
      } else {
        if (result.message?.includes("email")) {
          setErrors(prev => ({ ...prev, email: result.message }))
        } else if (result.message?.includes("username")) {
          setErrors(prev => ({ ...prev, username: result.message }))
        } else {
          toast.error(result.message || "Registration failed. Please try again.")
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Join QuizMaster to create and share quizzes</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <InputField
                id="fullName"
                name="fullName"
                icon={<User />}
                placeholder="Enter your full name"
                value={userData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                disabled={isLoading}
                inputRef={fullNameRef}
              />

              {/* Username */}
              <InputField
                id="username"
                name="username"
                icon={<span className="text-gray-400">@</span>}
                placeholder="Choose a username"
                value={userData.username}
                onChange={handleChange}
                error={errors.username}
                disabled={isLoading}
              />

              {/* Email */}
              <InputField
                id="email"
                name="email"
                type="email"
                icon={<Mail />}
                placeholder="Enter your email address"
                value={userData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isLoading}
              />

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={userData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${errors.password
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500 dark:text-gray-300 text-sm font-medium focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register


const InputField = ({ id, name, type = "text", icon, placeholder, value, onChange, error, disabled, inputRef }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
      {name}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${error
            ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
)
