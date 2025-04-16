import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LandingPage from "../components/LandingPage";
import ShopPage from "../components/ShopPage";
import ContactPage from "../components/ContactPage";
import AboutUsPage from "../components/AboutUs";
import CheckoutPage from "../components/CheckoutPage";




import AdminDashboard from "../components/AdminDashboard";

import Login from "../components/Login.jsx"; // Updated import: Capital "L" and explicit .jsx
import PrivacyPolicy from "../components/PrivacyPolicy.jsx";
import TermsAndConditions from "../components/TermsAndConditions.jsx";
import ServicesPage from "../components/ServicesPage.jsx";

// ProtectedRoute component to restrict access to admin-only routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check if user is admin

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />; // Redirect non-admins to homepage
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/services" element={<ServicesPage />} />
       
        <Route path="/terms-condition" element={<TermsAndConditions />} />
      
        <Route path="/login" element={<Login />} /> {/* Removed redundant <Login></Login> syntax */}

        {/* Admin-Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* Fallback Route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;