import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer'; // Adjust path as needed

const BACKEND_URL = 'https://backendforshop.onrender.com';

// Retry utility for API calls with sanitized logging
const withRetry = async (fn, retries = 3, delay = 6000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw new Error('API call failed after retries');
      console.warn(`Retry ${i + 1}/${retries} failed: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  const div = document.createElement('div');
  div.textContent = input.trim();
  return div.innerHTML;
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], step: initialStep = 1, order: initialOrder = null } = location.state || {};

  const [step, setStep] = useState(initialStep);
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customer: { firstName: '', lastName: '', email: '', phone: '' },
    shippingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: 'Uttar Pradesh',
      pincode: '201310',
      country: 'India',
    },
    shippingMethod: { type: 'Standard', cost: 80 },
    coupon: { code: '', discount: 0 },
    gstDetails: { gstNumber: '', state: 'Uttar Pradesh', city: 'Gautam Buddha Nagar' },
    paymentMethod: 'COD',
  });
  const [stateSearch, setStateSearch] = useState(formData.shippingAddress.state);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Scroll to section utility
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate shipping cost and apply coupon
  useEffect(() => {
    let shippingCost = 80;
    if (subtotal >= 800) shippingCost = 0;
    else if (subtotal >= 500) shippingCost = 50;
    if (formData.coupon.code.toUpperCase() === 'FREESHIPPING') shippingCost = 0;

    setFormData((prev) => ({
      ...prev,
      shippingMethod: { ...prev.shippingMethod, cost: shippingCost },
      coupon: {
        ...prev.coupon,
        discount: formData.coupon.code.toUpperCase() === 'FREESHIPPING' ? prev.shippingMethod.cost : 0,
      },
    }));
  }, [subtotal, formData.coupon.code]);

  // Initial checks and pending transaction handling
  useEffect(() => {
    if (!cartItems.length && (step !== 3 || !order)) {
      navigate('/shop', { replace: true });
    }
    const pendingTransaction = JSON.parse(localStorage.getItem('pendingTransaction'));
    if (pendingTransaction && step === 2) {
      setPendingOrderId(pendingTransaction.orderId);
      setError('A pending payment was detected. Please complete, retry, or cancel the payment.');
    }
  }, [cartItems, navigate, step, order]);

  // Scroll to error message
  useEffect(() => {
    if (error) scrollToSection('error-message');
  }, [error]);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay SDK loaded');
    script.onerror = () => setError('Failed to load payment system. Please select Cash on Delivery.');
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Form input handler with sanitization
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    const sanitizedValue = sanitizeInput(value);
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: sanitizedValue },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  // Coupon application
  const applyCoupon = async () => {
    setCouponLoading(true);
    setError('');
    const couponCode = sanitizeInput(formData.coupon.code).toUpperCase();
    if (couponCode === 'FREESHIPPING') {
      setFormData((prev) => ({
        ...prev,
        shippingMethod: { ...prev.shippingMethod, cost: 0 },
        coupon: { code: 'FREESHIPPING', discount: prev.shippingMethod.cost },
      }));
    } else {
      setError('Invalid coupon code');
      let shippingCost = subtotal >= 800 ? 0 : subtotal >= 500 ? 50 : 80;
      setFormData((prev) => ({
        ...prev,
        shippingMethod: { ...prev.shippingMethod, cost: shippingCost },
        coupon: { code: prev.coupon.code, discount: 0 },
      }));
    }
    setCouponLoading(false);
  };

  // Step 1 form validation and submission
  const handleStep1Submit = (e) => {
    e.preventDefault();
    const { customer, shippingAddress, gstDetails } = formData;

    if (!cartItems.length) return setError('Your cart is empty');
    if (!customer.firstName.trim() || !customer.lastName.trim()) {
      return setError('Please enter your full name');
    }
    if (!/^[a-zA-Z\s]+$/.test(customer.firstName) || !/^[a-zA-Z\s]+$/.test(customer.lastName)) {
      return setError('Name should contain only letters and spaces');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return setError('Please enter a valid email');
    }
    if (!/^[0-9]{10}$/.test(customer.phone)) {
      return setError('Please enter a valid 10-digit phone number');
    }
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      return setError('Please enter a valid 6-digit pincode');
    }
    if (!shippingAddress.address1.trim() || !shippingAddress.city.trim() || !shippingAddress.state.trim()) {
      return setError('Please fill all required shipping address fields');
    }
    if (gstDetails.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstDetails.gstNumber)) {
      return setError('Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)');
    }

    setStep(2);
  };

  // Check pending order status
  const checkPendingOrderStatus = async (orderId) => {
    try {
      setLoading(true);
      const response = await withRetry(() =>
        axios.get(`${BACKEND_URL}/api/orders/pending`, {
          params: { orderId },
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );
      const pendingOrder = response.data.find((o) => o.orderId === orderId);
      if (!pendingOrder) {
        localStorage.removeItem('pendingTransaction');
        setPendingOrderId(null);
        setError('Previous payment session expired or completed. Please start a new payment.');
        return null;
      }
      return pendingOrder;
    } catch (error) {
      setError('Failed to check pending order status. Please try again or cancel the pending order.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel pending order
  const handleCancelPendingOrder = async () => {
    if (!pendingOrderId) return setError('No pending order found.');
    try {
      setLoading(true);
      await withRetry(() =>
        axios.delete(`${BACKEND_URL}/api/orders/pending/${pendingOrderId}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );
      localStorage.removeItem('pendingTransaction', null);
      setPendingOrderId(null);
      setError('');
      setStep(2);
    } catch (error) {
      setError('Failed to cancel pending order. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const items = cartItems.map((item) => ({
        productId: sanitizeInput(item.id),
        name: sanitizeInput(item.name),
        quantity: item.quantity,
        price: item.price,
        variant: sanitizeInput(item.variant || ''),
      }));
      const total = subtotal + formData.shippingMethod.cost - formData.coupon.discount;
      const orderData = {
        customer: {
          firstName: sanitizeInput(formData.customer.firstName),
          lastName: sanitizeInput(formData.customer.lastName),
          email: sanitizeInput(formData.customer.email),
          phone: sanitizeInput(formData.customer.phone),
        },
        shippingAddress: {
          address1: sanitizeInput(formData.shippingAddress.address1),
          address2: sanitizeInput(formData.shippingAddress.address2 || ''),
          city: sanitizeInput(formData.shippingAddress.city),
          state: sanitizeInput(formData.shippingAddress.state),
          pincode: sanitizeInput(formData.shippingAddress.pincode),
          country: 'India',
        },
        shippingMethod: {
          type: formData.shippingMethod.type,
          cost: formData.shippingMethod.cost,
        },
        coupon: {
          code: sanitizeInput(formData.coupon.code),
          discount: formData.coupon.discount,
        },
        gstDetails: {
          gstNumber: sanitizeInput(formData.gstDetails.gstNumber || ''),
          state: sanitizeInput(formData.gstDetails.state),
          city: sanitizeInput(formData.gstDetails.city),
        },
        items,
        total,
        paymentMethod: sanitizeInput(formData.paymentMethod),
        paymentStatus: formData.paymentMethod === 'COD' ? 'Paid' : 'Pending',
        date: new Date().toISOString(),
        emailSent: false,
      };

      if (formData.paymentMethod === 'Razorpay' && pendingOrderId) {
        const pendingOrder = await checkPendingOrderStatus(pendingOrderId);
        if (!pendingOrder) return;
      }

      const orderResponse = await withRetry(() =>
        axios.post(`${BACKEND_URL}/api/orders`, orderData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );

      if (formData.paymentMethod === 'Razorpay') {
        const { orderId } = orderResponse.data.orderData || {};
        if (!orderId) throw new Error('Order initiation failed: Missing orderId');

        const razorpayPayload = {
          orderId,
          amount: Math.round(total * 100),
          currency: 'INR',
          receipt: `receipt_${orderId}`,
          customer: {
            name: `${sanitizeInput(formData.customer.firstName)} ${sanitizeInput(formData.customer.lastName)}`,
            email: sanitizeInput(formData.customer.email),
            contact: sanitizeInput(formData.customer.phone),
          },
          orderData: orderResponse.data.orderData,
        };

        const razorpayResponse = await withRetry(() =>
          axios.post(`${BACKEND_URL}/api/orders/initiate-razorpay-payment`, razorpayPayload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
          })
        );

        const { razorpayOrderId, keyId, orderData } = razorpayResponse.data;
        if (!razorpayOrderId || !keyId) throw new Error('Invalid Razorpay response');

        localStorage.setItem(
          'pendingTransaction',
          JSON.stringify({ orderId, razorpayOrderId, timestamp: Date.now() })
        );
        setPendingOrderId(orderId);

        if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

        const options = {
          key: keyId,
          amount: total * 100,
          currency: 'INR',
          name: 'NISARGMAITRI',
          description: `Order #${orderId}`,
          order_id: razorpayOrderId,
          handler: (response) =>
            navigate('/payment-callback', {
              state: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cartItems,
                orderData,
              },
            }),
          prefill: {
            name: `${sanitizeInput(formData.customer.firstName)} ${sanitizeInput(formData.customer.lastName)}`,
            email: sanitizeInput(formData.customer.email),
            contact: sanitizeInput(formData.customer.phone),
          },
          theme: { color: '#1A3329' },
          modal: {
            ondismiss: async () => {
              const pendingOrder = await checkPendingOrderStatus(orderId);
              if (pendingOrder) {
                setError('Payment was cancelled. Your order is pending. Please retry or cancel payment.');
                setStep(2);
              } else {
                setError('Payment session expired. Please start a new order.');
                localStorage.removeItem('pendingTransaction');
                setPendingOrderId(null);
                setStep(2);
              }
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          setError(`Payment failed: ${response.error.description}. Please retry or cancel the pending order.`);
          setStep(2);
          setLoading(false);
        });
        rzp.open();
      } else {
        const { order } = orderResponse.data;
        if (!order?.orderId) throw new Error('Order creation failed');
        setOrder(order);
        localStorage.removeItem('pendingTransaction');
        localStorage.removeItem('cart'); // Clear cart after successful COD order
        setPendingOrderId(null);
        setStep(3);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to process order. Please try again.';
      setError(errorMsg.includes('duplicate key') ? 'Order ID already exists. Please try again.' : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Retry payment
  const handleRetryPayment = async () => {
    if (!pendingOrderId) return setError('No pending order found.');
    const pendingOrder = await checkPendingOrderStatus(pendingOrderId);
    if (!pendingOrder) return;

    setLoading(true);
    setError('');

    try {
      const razorpayPayload = {
        orderId: pendingOrderId,
        amount: Math.round(pendingOrder.total * 100),
        currency: 'INR',
        receipt: `receipt_${pendingOrderId}`,
        customer: {
          name: `${sanitizeInput(formData.customer.firstName)} ${sanitizeInput(formData.customer.lastName)}`,
          email: sanitizeInput(formData.customer.email),
          contact: sanitizeInput(formData.customer.phone),
        },
        orderData: pendingOrder,
      };

      const razorpayResponse = await withRetry(() =>
        axios.post(`${BACKEND_URL}/api/orders/initiate-razorpay-payment`, razorpayPayload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        })
      );

      const { razorpayOrderId, keyId, orderData } = razorpayResponse.data;
      if (!razorpayOrderId || !keyId) throw new Error('Invalid Razorpay response');

      localStorage.setItem(
        'pendingTransaction',
        JSON.stringify({ orderId: pendingOrderId, razorpayOrderId, timestamp: Date.now() })
      );

      const options = {
        key: keyId,
        amount: pendingOrder.total * 100,
        currency: 'INR',
        name: 'NISARGMAITRI',
        description: `Order #${pendingOrderId}`,
        order_id: razorpayOrderId,
        handler: (response) =>
          navigate('/payment-callback', {
            state: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              orderData,
            },
          }),
        prefill: {
          name: `${sanitizeInput(formData.customer.firstName)} ${sanitizeInput(formData.customer.lastName)}`,
          email: sanitizeInput(formData.customer.email),
          contact: sanitizeInput(formData.customer.phone),
        },
        theme: { color: '#1A3329' },
        modal: {
          ondismiss: async () => {
            const pendingOrder = await checkPendingOrderStatus(pendingOrderId);
            if (pendingOrder) {
              setError('Payment was cancelled. Your order is pending. Please retry or cancel payment.');
              setStep(2);
            } else {
              setError('Payment session expired. Please start a new order.');
              localStorage.removeItem('pendingTransaction');
              setPendingOrderId(null);
              setStep(2);
            }
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}. Please retry or cancel the pending order.`);
        setStep(2);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      setError('Failed to retry payment. Please try again or cancel the pending order.');
    } finally {
      setLoading(false);
    }
  };

  // State search handlers
  const handleStateSearch = (e) => {
    const value = sanitizeInput(e.target.value);
    setStateSearch(value);
    setShowStateSuggestions(true);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, state: value },
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

  const total = subtotal + formData.shippingMethod.cost - formData.coupon.discount;
  const indianStates = [
    'Andaman and Nicobar Islands', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
    'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
    'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ].sort();

  const filteredStates = indianStates.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Payment callback component
  const PaymentCallback = () => {
    useEffect(() => {
      const verifyPayment = async () => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, cartItems, orderData } = location.state || {};
        const pendingTransaction = JSON.parse(localStorage.getItem('pendingTransaction'));

        if (
          !pendingTransaction ||
          !razorpay_payment_id ||
          !razorpay_order_id ||
          !razorpay_signature ||
          !orderData ||
          pendingTransaction.razorpayOrderId !== razorpay_order_id
        ) {
          setError('Invalid payment data. Please try again.');
          navigate('/checkout', { state: { step: 2, cartItems } });
          return;
        }

        if (Date.now() - pendingTransaction.timestamp > 24 * 60 * 60 * 1000) {
          setError('Transaction expired. Please initiate a new payment.');
          localStorage.removeItem('pendingTransaction');
          setPendingOrderId(null);
          navigate('/checkout', { state: { step: 2, cartItems } });
          return;
        }

        try {
          setLoading(true);
          const response = await withRetry(() =>
            axios.post(
              `${BACKEND_URL}/api/orders/verify-razorpay-payment`,
              {
                orderId: pendingTransaction.orderId,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                orderData,
              },
              { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
            )
          );

          if (response.data.success) {
            setOrder(response.data.order);
            localStorage.removeItem('pendingTransaction');
            localStorage.removeItem('cart'); // Clear cart after successful Razorpay order
            setPendingOrderId(null);
            navigate('/checkout', { state: { order: response.data.order, step: 3, cartItems: [] } });
          } else {
            setError('Payment verification failed. Please retry or contact support.');
            navigate('/checkout', { state: { step: 2, cartItems } });
          }
        } catch (error) {
          const pendingOrder = await checkPendingOrderStatus(pendingTransaction.orderId);
          setError(
            pendingOrder
              ? 'Payment verification failed. Your order is pending. Please retry or cancel.'
              : 'Order session expired. Please start a new order.'
          );
          if (!pendingOrder) {
            localStorage.removeItem('pendingTransaction');
            setPendingOrderId(null);
          }
          navigate('/checkout', { state: { step: 2, cartItems } });
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    }, []);

    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
        <p className="mt-2 text-gray-600">Please wait while we confirm your payment.</p>
        {loading && (
          <svg className="mx-auto mt-4 h-8 w-8 animate-spin text-[#1A3329]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    );
  };

  if (location.pathname === '/payment-callback') return <PaymentCallback />;

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <header className="bg-[#1A3329] p-4 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">NISARGMAITRI</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm hover:underline"
            aria-label="Continue Shopping"
          >
            <svg
              className="mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-center">
          <div className="flex w-full max-w-3xl items-center">
            {['Information', 'Payment', 'Confirmation'].map((label, index) => (
              <React.Fragment key={label}>
                <div
                  className={`flex flex-col items-center ${step > index + 1 ? 'text-[#1A3329]' : 'text-gray-400'}`}
                  aria-current={step === index + 1 ? 'step' : undefined}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step >= index + 1
                        ? 'border-[#1A3329] bg-[#1A3329] text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm font-medium">{label}</span>
                </div>
                {index < 2 && (
                  <div
                    className={`mx-2 h-1 flex-1 ${step > index + 1 ? 'bg-[#1A3329]' : 'bg-gray-300'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          {error && (
            <div
              id="error-message"
              className="mb-6 rounded-md bg-red-100 p-4 text-red-700"
              role="alert"
            >
              {error}
              {pendingOrderId && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleRetryPayment}
                    className="inline-flex items-center rounded-md bg-[#1A3329] px-4 py-2 text-white hover:bg-[#2F6844]"
                    disabled={loading}
                  >
                    Retry Payment (Order #{pendingOrderId})
                  </button>
                  <button
                    onClick={handleCancelPendingOrder}
                    className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                    disabled={loading}
                  >
                    Cancel Pending Order
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Billing Information */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <section className="lg:col-span-2 rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-2xl font-bold text-gray-900">
                  Billing Information
                </h2>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        First Name*
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="customer.firstName"
                        value={formData.customer.firstName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Last Name*
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="customer.lastName"
                        value={formData.customer.lastName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                      Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="customer.email"
                      value={formData.customer.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                      Phone*
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="customer.phone"
                      value={formData.customer.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                      aria-describedby="phone-desc"
                    />
                    <p id="phone-desc" className="mt-1 text-xs text-gray-500">
                      Enter a 10-digit phone number
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="address1"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Address 1*
                    </label>
                    <input
                      id="address1"
                      type="text"
                      name="shippingAddress.address1"
                      value={formData.shippingAddress.address1}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address2"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Address 2
                    </label>
                    <input
                      id="address2"
                      type="text"
                      name="shippingAddress.address2"
                      value={formData.shippingAddress.address2}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="relative">
                      <label
                        htmlFor="state"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        State*
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={stateSearch}
                        onChange={handleStateSearch}
                        onFocus={() => setShowStateSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowStateSuggestions(false), 300)}
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                        aria-controls="state-suggestions"
                      />
                      {showStateSuggestions && stateSearch && (
                        <ul
                          id="state-suggestions"
                          className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
                          role="listbox"
                        >
                          {filteredStates.length ? (
                            filteredStates.map((state) => (
                              <li
                                key={state}
                                onClick={() => selectState(state)}
                                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="option"
                                aria-selected={formData.shippingAddress.state === state}
                              >
                                {state}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-sm text-gray-500">No matching states</li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        City*
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pincode"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Pincode*
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        name="shippingAddress.pincode"
                        value={formData.shippingAddress.pincode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                        aria-describedby="pincode-desc"
                      />
                      <p id="pincode-desc" className="mt-1 text-xs text-gray-500">
                        Enter a 6-digit pincode
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">GST Details (Optional)</h3>
                    <div>
                      <label
                        htmlFor="gstNumber"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        GST Number
                      </label>
                      <input
                        id="gstNumber"
                        type="text"
                        name="gstDetails.gstNumber"
                        value={formData.gstDetails.gstNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                        aria-describedby="gst-desc"
                      />
                      <p id="gst-desc" className="mt-1 text-xs text-gray-500">
                        Enter a valid 15-digit GST number (e.g., 22AAAAA0000A1Z5)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                    <button
                      type="submit"
                      className="w-full rounded-md bg-[#1A3329] px-8 py-3 text-white hover:bg-[#2F6844] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      disabled={loading}
                    >
                      Continue to Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="w-full rounded-md bg-gray-200 px-8 py-3 text-gray-800 hover:bg-gray-300 sm:w-auto"
                      disabled={loading}
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </section>
              <aside className="h-fit rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>
                <div className="mb-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-800">{sanitizeInput(item.name)}</span>
                        <span className="ml-1 text-xs text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{formData.shippingMethod.cost.toLocaleString('en-IN')}</span>
                  </div>
                  {formData.coupon.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span>-₹{formData.coupon.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <section className="lg:col-span-2 rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-2xl font-bold text-gray-900">
                  Payment Method
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset className="space-y-4">
                    <legend className="sr-only">Payment Method</legend>
                    {[
                      {
                        value: 'Razorpay',
                        label: 'Razorpay',
                        description: 'Pay using UPI, Cards, Netbanking, etc.',
                      },
                      { value: 'COD', label: 'Cash on Delivery', description: 'Pay upon receipt' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className="flex cursor-pointer items-center rounded-md border p-4 hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleChange}
                          className="h-5 w-5 text-[#1A3329]"
                          id={`payment-${method.value.toLowerCase()}`}
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-900">{method.label}</span>
                          <span className="block text-sm text-gray-500">{method.description}</span>
                        </div>
                      </label>
                    ))}
                  </fieldset>
                  <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                    <button
                      type="submit"
                      className="order-2 flex-1 rounded-md bg-[#1A3329] px-6 py-3 text-white hover:bg-[#2F6844] disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
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
                          Processing...
                        </span>
                      ) : pendingOrderId ? (
                        `Retry Payment (Order #${pendingOrderId})`
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="order-1 rounded-md bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300 sm:order-2"
                      disabled={loading}
                    >
                      Back to Billing
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="order-3 rounded-md bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300"
                      disabled={loading}
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </section>
              <aside className="h-fit rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>
                <div className="mb-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-800">{sanitizeInput(item.name)}</span>
                        <span className="ml-1 text-xs text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mb-4 border-y border-gray-200 py-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-900">Apply Coupon</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={formData.coupon.code}
                      onChange={(e) =>
                        handleChange({ target: { name: 'coupon.code', value: e.target.value } })
                      }
                      className="flex-1 text-sm rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                      aria-label="Coupon code"
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="rounded-md bg-[#1A3329] px-3 py-2 text-sm font-medium text-white hover:bg-[#2F6844] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={couponLoading}
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {formData.coupon.discount > 0 && (
                    <p className="mt-2 flex items-center text-sm text-green-600">
                      <svg
                        className="mr-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Free shipping applied! (Discount: ₹{formData.coupon.discount})
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{formData.shippingMethod.cost.toLocaleString('en-IN')}</span>
                  </div>
                  {formData.coupon.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span>-₹{formData.coupon.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && (
            <>
              {order ? (
                <section className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-8 w-8 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Thank You for Your Order!</h2>
                    <p className="mt-2 text-gray-600">
                      Your order has been confirmed and will be shipped soon.
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      A confirmation email has been sent to <span className="font-semibold">{sanitizeInput(order.customer.email)}</span>.
                    </p>
                    <p className="mt-2 font-semibold text-gray-700">
                      Order ID: <span className="font-bold">{order.orderId}</span>
                    </p>
                    {order.paymentMethod === 'Razorpay' && order.paymentId && (
                      <p className="mt-1 text-sm text-gray-600">
                        Payment ID: <span className="font-semibold">{order.paymentId}</span>
                      </p>
                    )}
                  </div>
                  <div className="border-t border-b border-gray-200 py-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Order Summary</h3>
                    <div className="space-y-2">
                      {order.order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">{sanitizeInput(item.name)}</span>
                            <span className="text-xs text-gray-500">Quantity: {item.quantity}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span>₹{order.shippingMethod.cost.toLocaleString('en-IN')}</span>
                      </div>
                      {order.coupon?.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coupon Discount:</span>
                          <span>-₹{order.coupon?.discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold text-gray-700">
                        <span>Total:</span>
                        <span>₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Customer Details:</h3>
                      <p className="text-sm font-medium text-gray-600">
                        {sanitizeInput(order.customer.firstName)} {sanitizeInput(order.customer.lastName)}
                      </p>
                      <p className="text-sm text-gray-600">{sanitizeInput(order.customer.email)}</p>
                      <p className="text-sm text-gray-600">{sanitizeInput(order.customer.phone)}</p>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Shipping Details:</h3>
                      <p className="text-sm font-medium text-gray-600">{sanitizeInput(order.shippingAddress.address1)}</p>
                      {order.shippingAddress.address2 && (
                        <p className="text-sm font-medium text-gray-600">{sanitizeInput(order.shippingAddress.address2)}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {sanitizeInput(order.shippingAddress.city)}, {sanitizeInput(order.shippingAddress.state)} -{' '}
                        {sanitizeInput(order.shippingAddress.pincode)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Method: {sanitizeInput(order.shippingMethod.type)}  
                      </p>
                    </div>
                    {order.gstDetails?.gstNumber && (
                      <div className="mt-6 col-span-full">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">GST Details:</h3>
                        <p className="text-sm font-medium text-gray-600">
                          GST Number: {sanitizeInput(order.gstDetails.gstNumber)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {sanitizeInput(order.gstDetails.city)}, {sanitizeInput(order.gstDetails.state)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate('/')}
                      className="rounded-md bg-[#1A3329] px-6 py-2 text-sm font-medium text-white hover:bg-[#2F6844]"
                      aria-label="Continue Browsing"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </section>
              ) : (
                <div className="mx-auto max-w-xl text-center py-6">
                  <p className="text-red-600 text-sm">No order found. Please try again or contact support.</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 rounded-md bg-[#1A3329] px-6 py-2 text-sm font-medium text-white hover:bg-[#2F6844]"
                    aria-label="Back to Shop"
                  >
                    Back to Shop
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;