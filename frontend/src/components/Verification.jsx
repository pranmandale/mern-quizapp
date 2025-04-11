"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { MailCheck, Loader2, ShieldCheck } from "lucide-react"

const Verification = () => {
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const value = e.target.value
        // Allow only numbers and limit to 6 digits
        if (/^\d{0,6}$/.test(value)) {
            setOtp(value)
        }
    }

    


    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // 👈 essential for cookies
                body: JSON.stringify({ otp }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("✅ Account verified successfully!");
                // No need to store token manually; cookie is already set
                navigate("/dashboard"); // 👈 Navigate after cookie is set
            } else {
                toast.error(result.message || "Invalid or expired OTP.");
            }
        } catch (error) {
            toast.error("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };



    const handleResend = () => {
        // Trigger resend logic here
        toast.info("OTP has been resent to your email.")
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mb-4">
                                <MailCheck className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                We’ve sent a 6-digit code to your email.
                            </p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-5">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otp}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-center tracking-widest text-lg disabled:opacity-70"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-4 w-4" />
                                        Verify OTP
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

export default Verification
