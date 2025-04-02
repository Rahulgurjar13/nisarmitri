import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://nisarmitri.vercel.app/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, isAdmin, email: userEmail } = response.data;

      // Check if the user is an admin
      if (!isAdmin) {
        setError("Only admin users can log in to this portal.");
        setLoading(false);
        return;
      }

      // Store token and admin status in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin.toString());
      localStorage.setItem("userEmail", userEmail);

      // Redirect to admin dashboard
      navigate("/admin", { replace: true });
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        errorMessage = err.response.data.error || "Invalid email or password.";
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.status === 400) {
          errorMessage = "Email and password are required.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check if the server is running.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle go back to home navigation
  const handleGoBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A3329] hover:bg-[#2F6844] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3329] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
              ) : null}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        {/* Go Back to Home Button */}
        <div className="mt-4">
          <button
            onClick={handleGoBack}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3329]"
          >
            Go Back to Home
          </button>
        </div>

        {/* Optional: Link to Forgot Password */}
        <div className="mt-2 text-center text-sm text-gray-600">
          <p>
            <a
              href="/forgot-password"
              className="font-medium text-[#1A3329] hover:text-[#2F6844]"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
