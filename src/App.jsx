import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from '../components/LandingPage';
import ShopPage from '../components/ShopPage';
import ContactPage from '../components/ContactPage';
import AboutUsPage from '../components/AboutUs';
import CheckoutPage from '../components/CheckoutPage';
import BlogPage from '../components/BlogPage';
import CreateBlogPost from '../components/CreateBlogPost';
import BlogPostDetail from '../components/BlogPostDetail';
import AdminDashboard from '../components/AdminDashboard';
import EditBlogPost from '../components/EditBlogPost';
import Login from '../components/Login'; // Fixed casing to match your provided file

// ProtectedRoute component to restrict access to admin-only routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if user is admin

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
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/login" element={<Login />} />

        {/* Admin-Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-blog-post"
          element={
            <ProtectedRoute>
              <CreateBlogPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-blog-post/:id"
          element={
            <ProtectedRoute>
              <EditBlogPost />
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