import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5001";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const stableNavigate = useCallback((path, options) => navigate(path, options), [navigate]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/csrf-token`, {
        withCredentials: true,
      });
      console.log("Fetched CSRF token:", response.data.csrfToken);
      return response.data.csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error.message, error.response?.data);
      throw new Error("Failed to fetch CSRF token");
    }
  };

  const handleApiError = (error, operation) => {
    const status = error.response?.status;
    let message = `Failed to ${operation}. Please try again.`;
    
    if (error.response) {
      message = error.response.data?.error || error.response.data?.message || "Invalid email or password.";
      if (status === 401) {
        message = "Invalid email or password.";
      } else if (status === 400) {
        message = "Email and password are required.";
      } else if (status === 403) {
        message = error.response.data?.error || "Access denied. Please try again.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }
    } else if (error.request) {
      message = "Network error. Please check your connection and try again.";
    } else if (error.code === 'ECONNABORTED') {
      message = "Request timeout. Please try again.";
    }
    
    console.error(`${operation} error:`, status, message, error.response?.data);
    setError(message);
  };

  const validateInputs = () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError("Email address is required.");
      return false;
    }
    
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Password is required.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);

    try {
      const csrfToken = await fetchCsrfToken();
      console.log("Sending login request with CSRF token:", csrfToken);
      
      const response = await axios.post(
        `${getApiUrl()}/api/auth/login`,
        {
          email: email.trim(),
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Login response:", response.data);
      const { token, isAdmin, email: userEmail } = response.data;

      // Validate response data
      if (!token) {
        throw new Error("No authentication token received");
      }

      if (isAdmin === undefined || isAdmin === null) {
        throw new Error("User role information not received");
      }

      if (!isAdmin) {
        setError("Only admin users can log in to this portal.");
        return;
      }

      // Store user data
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", isAdmin.toString());
        localStorage.setItem("userName", userEmail || email.trim());
      } catch (storageError) {
        console.error("Failed to store user data:", storageError);
        setError("Failed to save login information. Please try again.");
        return;
      }

      // Navigate to admin page
      stableNavigate("/admin", { replace: true });
      
    } catch (error) {
      if (error.message === "No authentication token received" || 
          error.message === "User role information not received") {
        setError("Login response is incomplete. Please try again.");
      } else {
        handleApiError(error, "login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = useCallback(() => {
    stableNavigate("/", { replace: true });
  }, [stableNavigate]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                onChange={handleInputChange(setEmail)}
                required
                disabled={loading}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@example.com"
                autoComplete="email"
                aria-required="true"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

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
                onChange={handleInputChange(setPassword)}
                required
                disabled={loading}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-required="true"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A3329] hover:bg-[#2F6844] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3329] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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

          <div className="mt-4">
            <button
              onClick={handleGoBack}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3329] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Go Back to Home
            </button>
          </div>

          <div className="mt-2 text-center text-sm text-gray-600">
            <p>
              <a
                href="/forgot-password"
                className="font-medium text-[#1A3329] hover:text-[#2F6844] transition-colors duration-200"
                aria-label="Forgot your password?"
              >
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;