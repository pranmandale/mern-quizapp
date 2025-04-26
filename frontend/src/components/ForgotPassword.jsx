
"use client"

import React, { useState } from "react"
import { toast } from "react-toastify"
import { Mail, Loader2, KeyRound } from "lucide-react"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const trimmedEmail = email.trim()

        if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
            return toast.error("Please enter a valid email address.")
        }

        setIsLoading(true)

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) {
                toast.error("Backend URL not set in environment.")
                return setIsLoading(false)
            }

            const response = await fetch(`${backendUrl}/users/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail }),
                credentials: 'include',
            })

            const result = await response.json()

            if (response.ok) {
                toast.success("📩 Password reset link sent to your email.")
            } else {
                toast.error(result.message || "Something went wrong.")
            }
        } catch (error) {
            console.error("Forgot password error:", error)
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
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-4">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Enter your email and we’ll send you instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70"
                                    />
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
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="h-4 w-4" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            Remembered your password?{" "}
                            <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
