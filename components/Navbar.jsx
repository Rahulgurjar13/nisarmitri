import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Logo Component
const GreenoLogo = () => (
  <div className="transition-transform duration-300 hover:scale-105">
    <img src="/nisargmaitri.png" className="w-25 h-auto" alt="Greeno Logo" />
  </div>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  ); // Initial state from localStorage
  const location = useLocation();
  const navigate = useNavigate();

  // Check admin status on mount and token change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      return;
    }

    // Update isAdmin based on localStorage initially, then verify with backend
    setIsAdmin(localStorage.getItem("isAdmin") === "true");

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(
          "https://backendforshop.onrender.com/api/auth/check-admin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const adminStatus = response.data.isAdmin;
        setIsAdmin(adminStatus);
        localStorage.setItem("isAdmin", adminStatus.toString()); // Sync localStorage with backend
      } catch (error) {
        console.error("Failed to check admin status:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleLogout(); // Auto-logout on token invalidity
        }
      }
    };

    checkAdminStatus();
  }, []); // Only run on mount

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    setIsAdmin(false);
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/shop", label: "Shop Now" },
    { path: "/services", label: "Our Services" },
    { path: "/waste-management", label: "Waste Management" }, // Added Our Services
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-gray-50 font-serif">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between relative">
          <Link to="/" className="flex items-center">
            <GreenoLogo />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844] ${
                  location.pathname === path
                    ? "text-[#1A3329] font-semibold"
                    : ""
                }`}
              >
                {label}
                {location.pathname === path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1A3329]" />
                )}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`relative text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844] ${
                    location.pathname === "/admin"
                      ? "text-[#1A3329] font-semibold"
                      : ""
                  }`}
                >
                  Admin
                  {location.pathname === "/admin" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1A3329]" />
                  )}
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className={`relative text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844] ${
                  location.pathname === "/login"
                    ? "text-[#1A3329] font-semibold"
                    : ""
                }`}
              >
                Login
                {location.pathname === "/login" && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1A3329]" />
                )}
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              className="text-gray-900 hover:text-[#2F6844] transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu with animation */}
      <div
        className={`lg:hidden absolute inset-x-0 z-40 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex flex-col space-y-3 font-serif">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-gray-900 text-lg font-medium transition-all duration-200 pl-3 py-2 border-l-4 ${
                location.pathname === path
                  ? "border-[#1A3329] text-[#1A3329] bg-gray-100"
                  : "border-transparent hover:border-[#2F6844] hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`text-gray-900 text-lg font-medium transition-all duration-200 pl-3 py-2 border-l-4 ${
                  location.pathname === "/admin"
                    ? "border-[#1A3329] text-[#1A3329] bg-gray-100"
                    : "border-transparent hover:border-[#2F6844] hover:bg-gray-50"
                }`}
              >
                Admin
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className={`text-gray-900 text-lg font-medium transition-all duration-200 pl-3 py-2 border-l-4 ${
                location.pathname === "/login"
                  ? "border-[#1A3329] text-[#1A3329] bg-gray-100"
                  : "border-transparent hover:border-[#2F6844] hover:bg-gray-50"
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;