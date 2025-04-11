
"use client"

import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { KeyRound, Loader2 } from "lucide-react"

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!password || !confirmPassword) {
            return toast.error("Please fill out both fields.")
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.")
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPassword }),
            })


            const result = await response.json()

            if (response.ok) {
                toast.success("Password updated successfully. Please login.")
                navigate("/login")
            } else {
                toast.error(result.message || "Reset failed.")
            }
        } catch (err) {
            toast.error("Something went wrong. Try again.")
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
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your new password below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="h-4 w-4" />
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
