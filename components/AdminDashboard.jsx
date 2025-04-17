import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = "https://backendforshop.onrender.com";

const OrderRow = ({ order, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-6 text-gray-900 font-medium">{order.orderId}</td>
      <td className="py-4 px-6 text-gray-600">
        {order.customer.firstName} {order.customer.lastName}
      </td>
      <td className="py-4 px-6 text-gray-600">{formatDate(order.date)}</td>
      <td className="py-4 px-6 text-gray-600">
        ₹{order.total.toLocaleString("en-IN")}
      </td>
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

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4"
      />
    </svg>
    <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const lastFilterParams = useRef({}); // Cache last filter params

  const token = localStorage.getItem("token");
  const stableNavigate = useCallback((path) => navigate(path), [navigate]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!token) {
        if (mounted) {
          setError("Please log in to access the dashboard.");
          stableNavigate("/login");
        }
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching orders with token:", token);
        const ordersResponse = await axios.get(`${BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) {
          setOrders(ordersResponse.data);
          setFilteredOrders(ordersResponse.data);
          setError(null);
        }
      } catch (err) {
        console.error(
          "Fetch error:",
          err.response?.status,
          err.response?.data || err.message
        );
        if (mounted) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("userName");
            stableNavigate("/login");
          } else {
            setError("Failed to load data. Please try again later.");
            toast.error("Failed to load data. Please try again later.");
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

  const handleFilterOrders = useCallback(
    async (params) => {
      if (isFiltering) return;

      // Skip if params haven't changed
      if (
        JSON.stringify(params) === JSON.stringify(lastFilterParams.current) &&
        filteredOrders.length > 0
      ) {
        console.log(
          "Skipping duplicate filter with params:",
          JSON.stringify(params)
        );
        return;
      }

      // Skip if no date is provided
      if (!params.date) {
        setFilteredOrders(orders);
        lastFilterParams.current = {};
        return;
      }

      setIsFiltering(true);
      try {
        console.log("Filtering orders with params:", JSON.stringify(params));
        const response = await axios.get(`${BACKEND_URL}/api/orders`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredOrders(response.data);
        lastFilterParams.current = params;
        if (response.data.length === 0) {
          toast.info("No orders found for the selected date.");
        }
      } catch (error) {
        console.error(
          "Filter orders error:",
          error.response?.status,
          error.response?.data || error.message
        );
        setError("Failed to filter orders. Please try again.");
        toast.error("Failed to filter orders. Please try again.");
      } finally {
        setIsFiltering(false);
      }
    },
    [orders, token, isFiltering, filteredOrders.length]
  );

  const handleSearchOrders = useCallback(
    async (orderId) => {
      if (isSearching) return;

      // Skip if no order ID is provided
      if (!orderId.trim()) {
        setFilteredOrders(orders);
        return;
      }

      setIsSearching(true);
      try {
        const params = { orderId: orderId.trim() };
        console.log("Searching orders with params:", JSON.stringify(params));
        const response = await axios.get(`${BACKEND_URL}/api/orders`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredOrders(response.data);
        if (response.data.length === 0) {
          toast.info("No orders found for the provided Order ID.");
        }
      } catch (error) {
        console.error(
          "Search orders error:",
          error.response?.status,
          error.response?.data || error.message
        );
        setError("Failed to search orders. Please try again.");
        toast.error("Failed to search orders. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [orders, token, isSearching]
  );

  const debouncedHandleFilterOrders = useCallback(
    debounce((params) => handleFilterOrders(params), 600, {
      leading: false,
      trailing: true,
    }),
    [handleFilterOrders]
  );

  const debouncedHandleSearchOrders = useCallback(
    debounce((orderId) => handleSearchOrders(orderId), 600, {
      leading: false,
      trailing: true,
    }),
    [handleSearchOrders]
  );

  const clearFilters = () => {
    setFilterDate("");
    setSearchOrderId("");
    setFilteredOrders(orders);
    lastFilterParams.current = {};
    toast.success("Filters and search cleared.");
  };

  // Trigger date filtering when filterDate changes
  useEffect(() => {
    console.log("useEffect triggered with filterDate:", filterDate);
    const params = {};
    if (filterDate) params.date = filterDate;

    // Only trigger if a date is set
    if (filterDate) {
      debouncedHandleFilterOrders(params);
    } else if (lastFilterParams.current.date) {
      setFilteredOrders(orders); // Reset to all orders if no date filter
      lastFilterParams.current = {};
    }

    return () => {
      debouncedHandleFilterOrders.cancel();
    };
  }, [filterDate, debouncedHandleFilterOrders]);

  const handleViewOrderDetails = (order) => setSelectedOrder(order);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    stableNavigate("/");
  };

  const downloadOrderPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Invoice: ${order.orderId || "N/A"}`, 14, 20);
      doc.setFontSize(10);
      doc.text(
        `Date: ${new Date(order.date).toLocaleDateString("en-IN")}`,
        14,
        28
      );

      doc.setFontSize(12);
      doc.text("Customer Information", 14, 40);
      autoTable(doc, {
        startY: 45,
        head: [["Field", "Details"]],
        body: [
          [
            "Name",
            `${order.customer?.firstName || ""} ${
              order.customer?.lastName || ""
            }`,
          ],
          ["Email", order.customer?.email || "N/A"],
          ["Phone", order.customer?.phone || "N/A"],
        ],
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      let shippingY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Shipping Details", 14, shippingY);
      const shippingBody = [
        ["Address Line 1", order.shippingAddress?.address1 || "N/A"],
      ];
      if (order.shippingAddress?.address2)
        shippingBody.push(["Address Line 2", order.shippingAddress.address2]);
      shippingBody.push(
        [
          "City/State",
          `${order.shippingAddress?.city || ""}, ${
            order.shippingAddress?.state || ""
          }`,
        ],
        ["Pincode", order.shippingAddress?.pincode || "N/A"],
        ["Shipping Method", order.shippingMethod?.type || "Standard"],
      );
      autoTable(doc, {
        startY: shippingY + 5,
        head: [["Field", "Details"]],
        body: shippingBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      let itemsY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Items Purchased", 14, itemsY);
      autoTable(doc, {
        startY: itemsY + 5,
        head: [["Item Name", "Qty", "Unit Price (₹)", "Total (₹)"]],
        body: (order.items || []).map((item) => [
          item.name || "Unknown Item",
          item.quantity || 0,
          (item.price || 0)
            .toLocaleString("en-IN", { style: "currency", currency: "INR" })
            .replace("INR", "₹"),
          ((item.price || 0) * (item.quantity || 0))
            .toLocaleString("en-IN", { style: "currency", currency: "INR" })
            .replace("INR", "₹"),
        ]),
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: "center" },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 40, halign: "right" },
        },
      });

      let totalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      autoTable(doc, {
        startY: totalY,
        body: [
          [
            "Grand Total",
            (order.total || 0)
              .toLocaleString("en-IN", { style: "currency", currency: "INR" })
              .replace("INR", "₹"),
          ],
        ],
        styles: {
          fontSize: 11,
          cellPadding: 3,
          fontStyle: "bold",
          halign: "right",
        },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } },
      });

      let paymentY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Payment Information", 14, paymentY);
      const paymentBody = [["Payment Method", order.paymentMethod || "N/A"]];
      if (order.paymentMethod !== "COD" && order.razorpayPaymentId) {
        paymentBody.push(
          ["Payment ID", order.razorpayPaymentId],
          ["Status", "Paid"]
        );
      }
      autoTable(doc, {
        startY: paymentY + 5,
        head: [["Field", "Details"]],
        body: paymentBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [26, 51, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      });

      doc.save(`Invoice_${order.orderId || "unknown"}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("Failed to generate PDF. Please try again.");
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Admin Dashboard - Orders
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-colors duration-300"
            disabled={loading}
          >
            Logout
          </button>
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
              {error.includes("log in") && (
                <button
                  onClick={() => stableNavigate("/login")}
                  className="text-[#1A3329] hover:text-[#2F6844] font-medium"
                  disabled={loading}
                >
                  Go to Login
                </button>
              )}
            </div>
          ) : (
            <>
              {!selectedOrder ? (
                <>
                  <div className="p-6 flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex flex-col">
                        <label
                          htmlFor="searchOrderId"
                          className="text-sm font-medium text-gray-700 mb-1"
                        >
                          Order ID
                        </label>
                        <input
                          type="text"
                          id="searchOrderId"
                          value={searchOrderId}
                          onChange={(e) => setSearchOrderId(e.target.value)}
                          placeholder="Enter Order ID"
                          className="border border-gray-300 rounded-md p-2"
                          disabled={isSearching || loading}
                        />
                      </div>
                      <button
                        onClick={() => debouncedHandleSearchOrders(searchOrderId)}
                        className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-4 py-2 rounded-md"
                        disabled={isSearching || loading}
                      >
                        Search
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex flex-col">
                        <label
                          htmlFor="filterDate"
                          className="text-sm font-medium text-gray-700 mb-1"
                        >
                          Filter by Date
                        </label>
                        <input
                          type="date"
                          id="filterDate"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="border border-gray-300 rounded-md p-2"
                          disabled={isFiltering || loading}
                        />
                      </div>
                      <button
                        onClick={() =>
                          debouncedHandleFilterOrders({ date: filterDate })
                        }
                        className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-4 py-2 rounded-md"
                        disabled={isFiltering || loading}
                      >
                        Filter Orders
                      </button>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md self-end mt-4 md:mt-0"
                      disabled={isFiltering || isSearching || loading}
                    >
                      Clear Filters
                    </button>
                  </div>
                  {(isFiltering || isSearching) && (
                    <div className="p-6 text-center">
                      <svg
                        className="animate-spin h-5 w-5 text-[#1A3329] mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p>
                        {isFiltering
                          ? "Filtering orders..."
                          : "Searching orders..."}
                      </p>
                    </div>
                  )}
                  {filteredOrders.length > 0 ? (
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Order ID
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Customer
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Total
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Payment Method
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
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
                    <EmptyState message="No Orders Found for Selected Filters or Search" />
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
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                        />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Order Details: {selectedOrder.orderId}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Customer Information
                      </h3>
                      <p>{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</p>
                      <p>{selectedOrder.customer.email}</p>
                      <p>{selectedOrder.customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Shipping Details
                      </h3>
                      <p>{selectedOrder.shippingAddress.address1}</p>
                      {selectedOrder.shippingAddress.address2 && (
                        <p>{selectedOrder.shippingAddress.address2}</p>
                      )}
                      <p>{`${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}`}</p>
                      <p>
                        Shipping Method:{" "}
                        {selectedOrder.shippingMethod?.type || "Standard"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Items
                    </h3>
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                      <span>Total</span>
                      <span>
                        ₹{selectedOrder.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Payment Information
                    </h3>
                    <p>Payment Method: {selectedOrder.paymentMethod}</p>
                    {selectedOrder.paymentMethod !== "COD" &&
                      selectedOrder.razorpayPaymentId && (
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