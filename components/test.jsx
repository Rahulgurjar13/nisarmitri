import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import debounce from 'lodash/debounce';

const BACKEND_URL = 'http://localhost:5001';

const OrderRow = ({ order, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-6 text-gray-900 font-medium">{order.orderId}</td>
      <td className="py-4 px-6 text-gray-600">{order.customer.firstName} {order.customer.lastName}</td>
      <td className="py-4 px-6 text-gray-600">{formatDate(order.date)}</td>
      <td className="py-4 px-6 text-gray-600">₹{order.total.toLocaleString('en-IN')}</td>
      <td className="py-4 px-6 text-gray-600">{order.paymentMethod}</td>
      <td className="py-4 px-6">
        <button
          onClick={() => onViewDetails(order)}
          className="text-[#1A3329] hover:text-[#2F6844] font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

const BlogPostRow = ({ post, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <img
            src={post.coverImage ? `${BACKEND_URL}${post.coverImage}` : `${BACKEND_URL}/uploads/placeholder.jpg`}
            alt={post.title}
            className="w-12 h-12 object-cover rounded mr-4"
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = `${BACKEND_URL}/uploads/placeholder.jpg`;
              e.target.onError = null;
            }}
          />
          <span className="text-gray-900 font-medium">{post.title}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600">{post.category}</td>
      <td className="py-4 px-6 text-gray-600">{formatDate(post.date)}</td>
      <td className="py-4 px-6 text-gray-600">{post.author.name}</td>
      <td className="py-4 px-6 text-gray-600">{post.readTime} min</td>
      <td className="py-4 px-6">
        <div className="flex space-x-4">
          <button
            onClick={() => onEdit(post)}
            className="text-[#1A3329] hover:text-[#2F6844] font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4" />
    </svg>
    <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const token = localStorage.getItem('token');
  const stableNavigate = useCallback((path) => navigate(path), [navigate]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!token) {
        if (mounted) {
          setError('Please log in to access the dashboard.');
          stableNavigate('/login');
        }
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching data with token:', token);
        const [postsResponse, ordersResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/posts`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (mounted) {
          setPosts(postsResponse.data);
          setOrders(ordersResponse.data);
          setFilteredOrders(ordersResponse.data);
          setError(null);
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.status, err.response?.data || err.message);
        if (mounted) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Session expired or unauthorized. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userName');
            stableNavigate('/login');
          } else {
            setError('Failed to load data. Please try again later.');
            setPosts([]);
            setOrders([]);
            setFilteredOrders([]);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [token, stableNavigate]);

  const handleFilterOrders = useCallback(async () => {
    if (isFiltering) return;

    setIsFiltering(true);
    try {
      if (!startDate && !endDate) {
        setFilteredOrders(orders);
        return;
      }

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Filtering orders with params:', params);
      const response = await axios.get(`${BACKEND_URL}/api/orders`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Filter orders error:', error.response?.status, error.response?.data || error.message);
      setError('Failed to filter orders');
    } finally {
      setIsFiltering(false);
    }
  }, [startDate, endDate, orders, token, isFiltering]);

  const debouncedHandleFilterOrders = useCallback(
    debounce(handleFilterOrders, 500),
    [handleFilterOrders]
  );

  useEffect(() => {
    return () => {
      debouncedHandleFilterOrders.cancel();
    };
  }, [debouncedHandleFilterOrders]);

  const handleCreatePost = () => stableNavigate('/create-blog-post');
  const handleEditPost = (post) => stableNavigate(`/edit-blog-post/${post._id}`, { state: { post } });
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Delete post error:', error.response?.status, error.response?.data || error.message);
      setError('Failed to delete post');
    }
  };
  const handleViewOrderDetails = (order) => setSelectedOrder(order);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    stableNavigate('/');
  };

  const downloadOrderPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Invoice: ${order.orderId || 'N/A'}`, 14, 20);
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 14, 28);

      doc.setFontSize(12);
      doc.text("Customer Information", 14, 40);
      autoTable(doc, {
        startY: 45,
        head: [['Field', 'Details']],
        body: [
          ['Name', `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`],
          ['Email', order.customer?.email || 'N/A'],
          ['Phone', order.customer?.phone || 'N/A'],
        ],
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      let shippingY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Shipping Details", 14, shippingY);
      const shippingBody = [
        ['Address Line 1', order.shippingAddress?.address1 || 'N/A'],
      ];
      if (order.shippingAddress?.address2) shippingBody.push(['Address Line 2', order.shippingAddress.address2]);
      shippingBody.push(
        ['City/State', `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}`],
        ['Pincode', order.shippingAddress?.pincode || 'N/A'],
        ['Shipping Method', order.shippingMethod?.type || 'Standard']
      );
      autoTable(doc, {
        startY: shippingY + 5,
        head: [['Field', 'Details']],
        body: shippingBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      let itemsY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Items Purchased", 14, itemsY);
      autoTable(doc, {
        startY: itemsY + 5,
        head: [['Item Name', 'Qty', 'Unit Price (₹)', 'Total (₹)']],
        body: (order.items || []).map(item => [
          item.name || 'Unknown Item',
          item.quantity || 0,
          (item.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('INR', '₹'),
          ((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('INR', '₹'),
        ]),
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' },
        },
      });

      let totalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      autoTable(doc, {
        startY: totalY,
        body: [
          ['Grand Total', (order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('INR', '₹')],
        ],
        styles: { fontSize: 11, cellPadding: 3, fontStyle: 'bold', halign: 'right' },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } },
      });

      let paymentY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Payment Information", 14, paymentY);
      const paymentBody = [['Payment Method', order.paymentMethod || 'N/A']];
      if (order.paymentMethod !== 'COD' && order.razorpayPaymentId) {
        paymentBody.push(['Payment ID', order.razorpayPaymentId], ['Status', 'Paid']);
      }
      autoTable(doc, {
        startY: paymentY + 5,
        head: [['Field', 'Details']],
        body: paymentBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      doc.save(`Invoice_${order.orderId || 'unknown'}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex space-x-4">
            {activeTab === 'posts' && (
              <button
                onClick={handleCreatePost}
                className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-5 py-2 rounded-md transition-colors duration-300 inline-flex items-center"
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Post
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-colors duration-300"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'posts' ? 'border-b-2 border-[#1A3329] text-[#1A3329]' : 'text-gray-600'}`}
              disabled={loading}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'orders' ? 'border-b-2 border-[#1A3329] text-[#1A3329]' : 'text-gray-600'}`}
              disabled={loading}
            >
              Orders
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="animate-pulse p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-red-600 flex justify-between items-center">
              {error}
              {error.includes('log in') && (
                <button
                  onClick={() => stableNavigate('/login')}
                  className="text-[#1A3329] hover:text-[#2F6844] font-medium"
                  disabled={loading}
                >
                  Go to Login
                </button>
              )}
            </div>
          ) : activeTab === 'posts' ? (
            posts.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Read Time</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <BlogPostRow
                      key={post._id}
                      post={post}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="No Posts Found" />
            )
          ) : (
            <>
              {!selectedOrder ? (
                <>
                  <div className="p-6 flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col">
                      <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                        disabled={isFiltering || loading}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                        disabled={isFiltering || loading}
                      />
                    </div>
                    <button
                      onClick={debouncedHandleFilterOrders}
                      className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-4 py-2 rounded-md mt-6 md:mt-0 self-end"
                      disabled={isFiltering || loading}
                    >
                      Filter Orders
                    </button>
                  </div>
                  {filteredOrders.length > 0 ? (
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Order ID</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Customer</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Total</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <OrderRow
                            key={order.orderId}
                            order={order}
                            onViewDetails={handleViewOrderDetails}
                          />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <EmptyState message="No Orders Found for Selected Date Range" />
                  )}
                </>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-[#1A3329] hover:text-[#2F6844]"
                      disabled={loading}
                    >
                      ← Back to Orders
                    </button>
                    <button
                      onClick={() => downloadOrderPDF(selectedOrder)}
                      className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                      disabled={loading}
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details: {selectedOrder.orderId}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                      <p>{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</p>
                      <p>{selectedOrder.customer.email}</p>
                      <p>{selectedOrder.customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Details</h3>
                      <p>{selectedOrder.shippingAddress.address1}</p>
                      {selectedOrder.shippingAddress.address2 && <p>{selectedOrder.shippingAddress.address2}</p>}
                      <p>{`${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}`}</p>
                      <p>Shipping Method: {selectedOrder.shippingMethod?.type || 'Standard'}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Items</h3>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
                    <p>Payment Method: {selectedOrder.paymentMethod}</p>
                    {selectedOrder.paymentMethod !== 'COD' && selectedOrder.razorpayPaymentId && (
                      <>
                        <p>Payment ID: {selectedOrder.razorpayPaymentId}</p>
                        <p>Status: Paid</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;