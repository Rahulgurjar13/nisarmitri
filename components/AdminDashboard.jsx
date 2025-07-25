import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderRow = ({ order, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-2 px-3 sm:px-4 md:px-6 text-gray-900 font-medium text-sm sm:text-base">
        {order.orderId}
      </td>
      <td className="py-2 px-3 sm:px-4 md:px-6 text-gray-600 text-sm sm:text-base">
        {order.customer.firstName} {order.customer.lastName}
      </td>
      <td className="py-2 px-3 sm:px-4 md:px-6 text-gray-600 text-sm sm:text-base">
        {formatDate(order.createdAt || order.date)}
      </td>
      <td className="py-2 px-3 sm:px-4 md:px-6 text-gray-600 text-sm sm:text-base">
        ₹{order.total.toLocaleString("en-IN")}
      </td>
      <td className="py-2 px-3 sm:px-4 md:px-6 text-gray-600 text-sm sm:text-base">
        {order.paymentMethod}
      </td>
      <td className="py-2 px-3 sm:px-4 md:px-6">
        <button
          onClick={() => onViewDetails(order)}
          className="text-[#1A3329] hover:text-[#2F6844] font-medium text-sm sm:text-base"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <svg
      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4"
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
    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">{message}</h3>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const lastFilterParams = useRef({});
  const prevFilterDate = useRef(new Date().toISOString().split("T")[0]);
  const isFilterPending = useRef(false);
  const eventSourceRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const token = localStorage.getItem("token");
  const stableNavigate = useCallback((path) => navigate(path), [navigate]);
  const memoizedOrders = useMemo(() => orders, [orders]);

  const getApiUrl = () => import.meta.env.VITE_API_URL || "https://backendforshop.onrender.com";

  const withRetry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Retry ${i + 1}/${retries} failed:`, error.message);
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const handleApiError = (error, operation) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || `Failed to ${operation}. Please try again later.`;
    console.error(`${operation} error:`, status, message);

    if (status === 401 || status === 403) {
      setError("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userName");
      stableNavigate("/login");
    } else {
      setError(message);
      toast.error(message);
    }
    return { isCsrfError: false, message };
  };

  const applyFilters = useCallback(
    (ordersToFilter) => {
      let filtered = ordersToFilter.filter((order) => ['Success', 'Paid'].includes(order.paymentStatus));
      if (filterDate && filterDate !== new Date().toISOString().split("T")[0]) {
        filtered = filtered.filter(
          (order) => {
            const orderDate = order.createdAt || order.date;
            return orderDate && new Date(orderDate).toISOString().split("T")[0] === filterDate;
          }
        );
      }
      if (searchOrderId.trim()) {
        filtered = filtered.filter((order) =>
          order.orderId.toLowerCase().includes(searchOrderId.trim().toLowerCase())
        );
      }
      return filtered;
    },
    [filterDate, searchOrderId]
  );

  const fetchOrders = useCallback(
    async (params = {}) => {
      if (!token) {
        setError("Please log in to access the dashboard.");
        stableNavigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await withRetry(() =>
          axios.get(`${getApiUrl()}/api/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
            timeout: 10000,
            withCredentials: true,
          })
        );

        const paidOrders = response.data.filter((order) => ['Success', 'Paid'].includes(order.paymentStatus));
        setOrders(paidOrders);
        setFilteredOrders(applyFilters(paidOrders));
        setError(null);
        console.log(`Fetched ${paidOrders.length} successful/paid orders`);
      } catch (error) {
        handleApiError(error, "fetch orders");
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [token, stableNavigate, applyFilters]
  );

  const setupSSE = useCallback(() => {
    if (!token) {
      setError("Please log in to access SSE updates.");
      stableNavigate("/login");
      return;
    }

    const connectSSE = () => {
      const eventSource = new EventSource(`${getApiUrl()}/api/order-updates?token=${token}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connection established");
        setSseConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        toast.success("Real-time order updates connected.");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("SSE event received:", data);

          if (data.event === "newOrder" || data.event === "orderUpdated") {
            const order = data.order;
            if (['Success', 'Paid'].includes(order.paymentStatus)) {
              setOrders((prevOrders) => {
                const orderExists = prevOrders.some((o) => o.orderId === order.orderId);
                const updatedOrders = orderExists
                  ? prevOrders.map((o) => (o.orderId === order.orderId ? order : o))
                  : [...prevOrders, order];
                return updatedOrders;
              });
              setFilteredOrders((prevFiltered) => {
                const filtered = applyFilters([...prevFiltered, order]);
                return filtered;
              });
              toast.success(
                `Order ${order.orderId} ${data.event === "newOrder" ? "created" : "updated"}.`
              );
            }
          }
        } catch (err) {
          console.error("SSE message parsing error:", err);
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection error");
        setSseConnected(false);
        eventSource.close();
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectAttempts.current += 1;
          console.log(`Reconnecting SSE in ${delay}ms (attempt ${reconnectAttempts.current})`);
          setTimeout(connectSSE, delay);
        } else {
          setError("Failed to maintain real-time updates. Please refresh the page.");
          toast.error("Real-time updates disconnected. Please refresh.");
        }
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        console.log("Closing SSE connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [token, stableNavigate, applyFilters]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;
      await fetchOrders();
      return setupSSE();
    };

    const cleanup = initialize();

    return () => {
      mounted = false;
      cleanup.then((closeSSE) => closeSSE && closeSSE());
    };
  }, [fetchOrders, setupSSE]);

  const handleFilterOrders = useCallback(
    async (params) => {
      if (isFiltering) {
        console.log("Skipping filter: already filtering");
        return;
      }

      if (
        JSON.stringify(params) === JSON.stringify(lastFilterParams.current) &&
        filteredOrders.length > 0
      ) {
        console.log("Skipping duplicate filter with params:", JSON.stringify(params));
        toast.info("No change in filter parameters.");
        return;
      }

      setIsFiltering(true);
      isFilterPending.current = true;
      try {
        const response = await withRetry(() =>
          axios.get(`${getApiUrl()}/api/orders`, {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
            withCredentials: true,
          })
        );

        const paidOrders = response.data.filter((order) => ['Success', 'Paid'].includes(order.paymentStatus));
        setFilteredOrders(paidOrders);
        lastFilterParams.current = params;
        if (paidOrders.length === 0) {
          toast.info("No successful orders found for the selected date.");
        }
        console.log(`Filtered ${paidOrders.length} successful/paid orders`);
      } catch (error) {
        handleApiError(error, "filter orders");
      } finally {
        setIsFiltering(false);
        isFilterPending.current = false;
      }
    },
    [token, isFiltering, filteredOrders.length]
  );

  const handleSearchOrders = useCallback(
    async (orderId) => {
      if (isSearching) {
        console.log("Skipping search: already searching");
        return;
      }

      if (!orderId.trim()) {
        setFilteredOrders(memoizedOrders);
        return;
      }

      setIsSearching(true);
      try {
        const params = { orderId: orderId.trim() };
        console.log("Searching orders with params:", JSON.stringify(params));
        const response = await withRetry(() =>
          axios.get(`${getApiUrl()}/api/orders`, {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
            withCredentials: true,
          })
        );

        const paidOrders = response.data.filter((order) => ['Success', 'Paid'].includes(order.paymentStatus));
        setFilteredOrders(paidOrders);
        if (paidOrders.length === 0) {
          toast.info("No successful orders found for the provided Order ID.");
        }
        console.log(`Searched ${paidOrders.length} successful/paid orders`);
      } catch (error) {
        handleApiError(error, "search orders");
      } finally {
        setIsSearching(false);
      }
    },
    [memoizedOrders, token, isSearching]
  );

  const debouncedHandleFilterOrders = useMemo(
    () => debounce(handleFilterOrders, 600, { leading: false, trailing: true }),
    [handleFilterOrders]
  );

  const debouncedHandleSearchOrders = useMemo(
    () => debounce(handleSearchOrders, 600, { leading: false, trailing: true }),
    [handleSearchOrders]
  );

  const clearFilters = () => {
    setFilterDate(new Date().toISOString().split("T")[0]);
    setSearchOrderId("");
    setFilteredOrders(memoizedOrders);
    lastFilterParams.current = {};
    prevFilterDate.current = new Date().toISOString().split("T")[0];
    isFilterPending.current = false;
    toast.success("Filters and search cleared.");
  };

  useEffect(() => {
    if (filterDate === prevFilterDate.current || isFilterPending.current) {
      return;
    }

    const params = filterDate ? { date: filterDate } : {};
    prevFilterDate.current = filterDate;

    if (filterDate !== new Date().toISOString().split("T")[0]) {
      debouncedHandleFilterOrders(params);
    } else {
      setFilteredOrders(applyFilters(memoizedOrders));
      lastFilterParams.current = {};
    }

    return () => debouncedHandleFilterOrders.cancel();
  }, [filterDate, debouncedHandleFilterOrders, memoizedOrders, applyFilters]);

  const handleViewOrderDetails = (order) => setSelectedOrder(order);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    stableNavigate("/");
  };

  const handleSearchClick = () => debouncedHandleSearchOrders(searchOrderId);

  const isFilterButtonDisabled = useMemo(
    () => isFiltering || loading || filterDate === prevFilterDate.current,
    [isFiltering, loading, filterDate]
  );

  const downloadOrderPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Invoice: ${order.orderId || "N/A"}`, 14, 20);
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(order.createdAt || order.date).toLocaleDateString("en-IN")}`, 14, 28);

      doc.setFontSize(12);
      doc.text("Customer Information", 14, 40);
      autoTable(doc, {
        startY: 45,
        head: [["Field", "Details"]],
        body: [
          ["Name", `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`],
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
      const shippingBody = [["Address Line 1", order.shippingAddress?.address1 || "N/A"]];
      if (order.shippingAddress?.address2) {
        shippingBody.push(["Address Line 2", order.shippingAddress.address2]);
      }
      shippingBody.push(
        ["City/State", `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}`],
        ["Pincode", order.shippingAddress?.pincode || "N/A"],
        ["Shipping Method", order.shippingMethod?.type || "Standard"]
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
          (item.price || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" }).replace("INR", "₹"),
          ((item.price || 0) * (item.quantity || 0)).toLocaleString("en-IN", { style: "currency", currency: "INR" }).replace("INR", "₹"),
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
          ["Grand Total", (order.total || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" }).replace("INR", "₹")],
        ],
        styles: { fontSize: 11, cellPadding: 3, fontStyle: "bold", halign: "right" },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } },
      });

      let paymentY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Payment Information", 14, paymentY);
      const paymentBody = [["Payment Method", order.paymentMethod || "N/A"]];
      if (order.paymentMethod !== "COD") {
        paymentBody.push(
          ["Payment ID", order.razorpayPaymentId || "N/A"],
          ["Razorpay Order ID", order.razorpayOrderId || "N/A"],
          ["Status", order.paymentStatus || "N/A"]
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
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard - Orders
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span
              className={`text-xs sm:text-sm ${
                sseConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {sseConnected ? "Real-time updates: Connected" : "Real-time updates: Disconnected"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-md transition-colors duration-300 text-sm sm:text-base"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="animate-pulse p-4 sm:p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="flex items-center space-x-2 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 sm:p-6 text-red-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm sm:text-base">{error}</span>
              {error.includes("log in") && (
                <button
                  onClick={() => stableNavigate("/login")}
                  className="text-[#1A3329] hover:text-[#2F6844] font-medium text-sm sm:text-base"
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
                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 flex-wrap">
                      <div className="flex-1 min-w-[150px]">
                        <label
                          htmlFor="searchOrderId"
                          className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Order ID
                        </label>
                        <input
                          type="text"
                          id="searchOrderId"
                          value={searchOrderId}
                          onChange={(e) => setSearchOrderId(e.target.value)}
                          placeholder="Enter Order ID"
                          className="border border-gray-300 rounded-md p-2 w-full text-sm sm:text-base"
                          disabled={isSearching || loading}
                        />
                      </div>
                      <button
                        onClick={handleSearchClick}
                        className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base"
                        disabled={isSearching || loading}
                      >
                        Search
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 flex-wrap">
                      <div className="flex-1 min-w-[150px]">
                        <label
                          htmlFor="filterDate"
                          className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Filter by Date
                        </label>
                        <input
                          type="date"
                          id="filterDate"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full text-sm sm:text-base"
                          disabled={isFiltering || loading}
                        />
                      </div>
                      <button
                        onClick={() => debouncedHandleFilterOrders({ date: filterDate })}
                        className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base"
                        disabled={isFilterButtonDisabled}
                      >
                        Filter Orders
                      </button>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base self-start"
                      disabled={isFiltering || isSearching || loading}
                    >
                      Clear Filters
                    </button>
                  </div>
                  {(isFiltering || isSearching) && (
                    <div className="p-4 sm:p-6 text-center">
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <p className="text-sm sm:text-base">
                        {isFiltering ? "Filtering orders..." : "Searching orders..."}
                      </p>
                    </div>
                  )}
                  {filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
                              Order ID
                            </th>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
                              Customer
                            </th>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
                              Date
                            </th>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
                              Total
                            </th>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
                              Payment
                            </th>
                            <th className="py-2 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-900">
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
                    </div>
                  ) : (
                    <EmptyState message="No Orders Found for Selected Filters or Search" />
                  )}
                </>
              ) : (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-[#1A3329] hover:text-[#2F6844] text-sm sm:text-base"
                      disabled={loading}
                    >
                      ← Back to Orders
                    </button>
                    <button
                      onClick={() => downloadOrderPDF(selectedOrder)}
                      className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors duration-300 flex items-center text-sm sm:text-base"
                      disabled={loading}
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Order Details: {selectedOrder.orderId}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Customer Information
                      </h3>
                      <p className="text-sm sm:text-base">{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</p>
                      <p className="text-sm sm:text-base">{selectedOrder.customer.email}</p>
                      <p className="text-sm sm:text-base">{selectedOrder.customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Shipping Details
                      </h3>
                      <p className="text-sm sm:text-base">{selectedOrder.shippingAddress.address1}</p>
                      {selectedOrder.shippingAddress.address2 && (
                        <p className="text-sm sm:text-base">{selectedOrder.shippingAddress.address2}</p>
                      )}
                      <p className="text-sm sm:text-base">{`${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}`}</p>
                      <p className="text-sm sm:text-base">Shipping Method: {selectedOrder.shippingMethod?.type || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Items Purchased
                    </h3>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b text-sm sm:text-base">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4 text-sm sm:text-base">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Payment Information
                    </h3>
                    <p className="text-sm sm:text-base">Payment Method: {selectedOrder.paymentMethod}</p>
                    {selectedOrder.paymentMethod !== "COD" && (
                      <>
                        <p className="text-sm sm:text-base">Payment ID: {selectedOrder.razorpayPaymentId || "N/A"}</p>
                        <p className="text-sm sm:text-base">Razorpay Order ID: {selectedOrder.razorpayOrderId || "N/A"}</p>
                        <p className="text-sm sm:text-base">Status: {selectedOrder.paymentStatus || "N/A"}</p>
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

export default React.memo(AdminDashboard);