import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: { firstName: "", lastName: "", email: "", phone: "" },
    shippingAddress: {
      address1: "",
      address2: "",
      city: "",
      state: "Uttar Pradesh",
      pincode: "201310",
      country: "India",
    },
    shippingMethod: { type: "Standard", cost: 160 },
    coupon: { code: "", discount: 0 },
    gstDetails: {
      gstNumber: "",
      state: "Uttar Pradesh",
      city: "Gautam Buddha Nagar",
    },
    paymentMethod: "UPI",
  });
  const [stateSearch, setStateSearch] = useState("");
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split(".");

    if (path.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [path[0]]: { ...prev[path[0]], [path[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyCoupon = () => {
    if (formData.coupon.code.toUpperCase() === "FREESHIPPING") {
      setFormData((prev) => ({
        ...prev,
        shippingMethod: { ...prev.shippingMethod, cost: 0 },
        coupon: { code: "FREESHIPPING", discount: 160 },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shippingMethod: { ...prev.shippingMethod, cost: 160 },
        coupon: { code: prev.coupon.code, discount: 0 },
      }));
      alert("Invalid coupon code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || "",
      }));

      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shippingCost =
        formData.coupon.discount > 0 ? 0 : formData.shippingMethod.cost;
      const tax = subtotal * 0.18;
      const total = subtotal + shippingCost + tax;

      const orderData = {
        ...formData,
        items,
        date: new Date().toISOString(),
        total,
      };

      // Real API call to backend (updated port to 5001)
      const response = await axios.post(
        "https://backendforshop.onrender.com/api/orders",
        orderData
      );

      setOrder(response.data.order);

      if (formData.paymentMethod !== "COD") {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || "mock_key",
          amount: response.data.order.total * 100,
          currency: "INR",
          name: "EcoShop",
          order_id: response.data.razorpayOrder?.id,
          handler: async function (response) {
            // Optionally verify payment with backend here
            setStep(3);
          },
          prefill: {
            name: `${formData.customer.firstName} ${formData.customer.lastName}`,
            email: formData.customer.email,
            contact: formData.customer.phone,
          },
          theme: { color: "#1A3329" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setStep(3);
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => navigate("/shop");

  const handleStateSearch = (e) => {
    setStateSearch(e.target.value);
    setShowStateSuggestions(true);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, state: e.target.value },
    }));
  };

  const selectState = (state) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, state },
    }));
    setStateSearch(state);
    setShowStateSuggestions(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost =
    formData.coupon.discount > 0 ? 0 : formData.shippingMethod.cost;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const filteredStates = indianStates.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      {/* Header */}
      <div className="bg-[#1A3329] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NISARGMAITRI</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-sm hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Checkout Progress */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl flex items-center">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-[#1A3329]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 1
                    ? "bg-[#1A3329] text-white border-[#1A3329]"
                    : "border-gray-300"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Information</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-[#1A3329]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-[#1A3329]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 2
                    ? "bg-[#1A3329] text-white border-[#1A3329]"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 3 ? "bg-[#1A3329]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-[#1A3329]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 3
                    ? "bg-[#1A3329] text-white border-[#1A3329]"
                    : "border-gray-300"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Billing Information */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Billing Information
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="customer.firstName"
                        value={formData.customer.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="customer.lastName"
                        value={formData.customer.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="customer.email"
                      value={formData.customer.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Phone*
                    </label>
                    <input
                      type="tel"
                      name="customer.phone"
                      value={formData.customer.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      title="10 digit phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address 1*
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.address1"
                      value={formData.shippingAddress.address1}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address 2
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.address2"
                      value={formData.shippingAddress.address2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        State*
                      </label>
                      <input
                        type="text"
                        value={stateSearch}
                        onChange={handleStateSearch}
                        onFocus={() => setShowStateSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowStateSuggestions(false), 200)
                        }
                        placeholder="Search state"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                      {showStateSuggestions && stateSearch && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                          {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                              <li
                                key={state}
                                onClick={() => selectState(state)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                {state}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-sm text-gray-500">
                              No matching states
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.pincode"
                        value={formData.shippingAddress.pincode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      GST Details (Optional)
                    </h3>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="gstDetails.gstNumber"
                        value={formData.gstDetails.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#1A3329] text-white px-8 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium"
                    >
                      Continue to Payment
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="w-full sm:w-auto bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm text-gray-800 font-medium">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Payment Method
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === "UPI"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-[#1A3329]"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900">
                          UPI Payment
                        </span>
                        <span className="block text-sm text-gray-500">
                          Pay using Google Pay, PhonePe, or any UPI app
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={formData.paymentMethod === "Card"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-[#1A3329]"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900">
                          Credit/Debit Card
                        </span>
                        <span className="block text-sm text-gray-500">
                          Pay using Visa, MasterCard, or RuPay
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-[#1A3329]"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900">
                          Cash on Delivery
                        </span>
                        <span className="block text-sm text-gray-500">
                          Pay when you receive your order
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`order-2 sm:order-1 flex-1 bg-[#1A3329] text-white px-6 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="order-1 sm:order-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                    >
                      Back to Billing
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="order-3 sm:order-3 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm text-gray-800 font-medium">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="coupon-section mt-4 mb-4 py-3 border-y border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Apply Coupon
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={formData.coupon.code}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "coupon.code",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-[#1A3329] text-white px-3 py-2 rounded-md hover:bg-[#2F6844] transition-colors duration-300 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {formData.coupon.discount > 0 && (
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Free shipping applied! (Discount: ₹
                      {formData.coupon.discount})
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && order && (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thank You for Your Order!
                </h2>
                <p className="text-gray-600 mt-1">
                  Your order has been confirmed and will be shipped soon.
                </p>
                <p className="text-gray-800 font-medium mt-2">
                  Order ID: <span className="font-bold">{order.orderId}</span>
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <p className="text-gray-800">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-gray-600">{order.customer.email}</p>
                  <p className="text-gray-600">{order.customer.phone}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Shipping Details
                  </h3>
                  <p className="text-gray-800">
                    {order.shippingAddress.address1}
                  </p>
                  {order.shippingAddress.address2 && (
                    <p className="text-gray-800">
                      {order.shippingAddress.address2}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">
                    Shipping Method: {order.shippingMethod.type}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#1A3329] text-white px-8 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
