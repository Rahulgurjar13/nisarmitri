import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:5001";

// Logo Component
const GreenoLogo = () => (
  <div className="transition-transform duration-300 hover:scale-105">
    <img
      src="/nisargmaitri.png"
      className="w-25 h-auto"
      alt="Nisargmaitri Logo"
    />
  </div>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const location = useLocation();
  const navigate = useNavigate();

  // Check admin status on mount and token change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      localStorage.setItem("isAdmin", "false");
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/auth/check-admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const adminStatus = response.data.isAdmin;
        setIsAdmin(adminStatus);
        localStorage.setItem("isAdmin", adminStatus.toString());
      } catch (error) {
        console.error("Failed to check admin status:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleLogout();
        }
      }
    };

    checkAdminStatus();
  }, []); // Run only on mount

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userEmail"); // Updated to match Login.jsx
    setIsAdmin(false);
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/shop", label: "Shop Now" },
    { path: "/services", label: "Our Services" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-gray-50 font-serif sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between relative">
        <Link to="/" className="flex items-center" aria-label="Nisargmaitri Home">
          <GreenoLogo />
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center space-x-8" role="navigation">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844] ${
                location.pathname === path
                  ? "text-[#1A3329] font-semibold"
                  : ""
              }`}
              aria-current={location.pathname === path ? "page" : undefined}
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
                aria-current={
                  location.pathname === "/admin" ? "page" : undefined
                }
              >
                Admin
                {location.pathname === "/admin" && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1A3329]" />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844]"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`relative text-gray-900 text-lg font-medium transition-all duration-300 hover:text-[#2F6844] ${
                location.pathname === "/login"
                  ? "text-[#1A3329] font-semibold"
                  : ""
              }`}
              aria-current={location.pathname === "/login" ? "page" : undefined}
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
                aria-hidden="true"
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

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden absolute inset-x-0 z-40 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        role="menu"
        aria-hidden={!mobileMenuOpen}
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
              role="menuitem"
              aria-current={location.pathname === path ? "page" : undefined}
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
                role="menuitem"
                aria-current={
                  location.pathname === "/admin" ? "page" : undefined
                }
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-900 text-lg font-medium transition-all duration-200 pl-3 py-2 border-l-4 border-transparent hover:border-[#2F6844] hover:bg-gray-50 text-left"
                role="menuitem"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`text-gray-900 text-lg font-medium transition-all duration-200 pl-3 py-2 border-l-4 ${
                location.pathname === "/login"
                  ? "border-[#1A3329] text-[#1A3329] bg-gray-100"
                  : "border-transparent hover:border-[#2F6844] hover:bg-gray-50"
              }`}
              role="menuitem"
              aria-current={location.pathname === "/login" ? "page" : undefined}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;