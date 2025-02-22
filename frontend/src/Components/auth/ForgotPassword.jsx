import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

            if (response.data.success) {
                setMessage("Password reset link sent to your email.");
            } else {
                setError(response.data.message || "Failed to send reset link.");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="text-center mt-4">
                    Remembered your password?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Go back to Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
