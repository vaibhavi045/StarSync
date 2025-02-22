import axios from "axios";

const API_URL = "/api/auth"; // Adjust this according to your backend setup

const authService = {
    // Register User
    async register(name, email, password) {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error("Registration Error:", error.response?.data?.error || error.message);
            throw error.response?.data?.error || "Registration failed";
        }
    },

    // Login User
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error("Login Error:", error.response?.data?.error || error.message);
            throw error.response?.data?.error || "Login failed";
        }
    },

    // Logout User
    logout() {
        localStorage.removeItem("token");
    },

    // Get Authenticated User Data
    async getUser() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.get(`${API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            console.error("Fetch User Error:", error.response?.data?.error || error.message);
            throw error.response?.data?.error || "Failed to fetch user data";
        }
    },

    // Check if User is Authenticated
    isAuthenticated() {
        return !!localStorage.getItem("token");
    },

    // Forgot Password - Request Reset Link
    async forgotPassword(email) {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data.message;
        } catch (error) {
            console.error("Forgot Password Error:", error.response?.data?.error || error.message);
            throw error.response?.data?.error || "Error in requesting password reset";
        }
    },

    // Reset Password - Update New Password
    async resetPassword(token, newPassword) {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
            return response.data.message;
        } catch (error) {
            console.error("Reset Password Error:", error.response?.data?.error || error.message);
            throw error.response?.data?.error || "Error in resetting password";
        }
    }
};

export default authService;
