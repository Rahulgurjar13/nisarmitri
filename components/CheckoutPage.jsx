import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

const BACKEND_URL = 'https://backendforshop.onrender.com';
const FRONTEND_URL = 'https://www.nisargmaitri.in';

// Retry utility for API calls
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

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  // Initialize state from localStorage if location.state is unavailable
  const [step, setStep] = useState(() => {
    const savedState = localStorage.getItem('checkoutState');
    return savedState ? JSON.parse(savedState).step : location.state?.step || 1;
  });
  const [order, setOrder] = useState(() => {
    const savedState = localStorage.getItem('checkoutState');
    return savedState ? JSON.parse(savedState).order : location.state?.order || null;
  });
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
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
    gstDetails: {
      gstNumber: '',
      state: 'Uttar Pradesh',
      city: 'Gautam Buddha Nagar',
    },
    paymentMethod: 'COD',
  });
  const [stateSearch, setStateSearch] = useState('');
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Save step and order to localStorage
  useEffect(() => {
    localStorage.setItem('checkoutState', JSON.stringify({ step, order }));
  }, [step, order]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    let shippingCost = 80;
    if (subtotal >= 800) {
      shippingCost = 0;
    } else if (subtotal >= 500) {
      shippingCost = 50;
    }

    if (formData.coupon.code.toUpperCase() === 'FREESHIPPING') {
      shippingCost = 0;
    }

    setFormData((prev) => ({
      ...prev,
      shippingMethod: { ...prev.shippingMethod, cost: shippingCost },
      coupon: {
        ...prev.coupon,
        discount: formData.coupon.code.toUpperCase() === 'FREESHIPPING' ? prev.shippingMethod.cost : 0,
      },
    }));
  }, [subtotal, formData.coupon.code]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      // Only redirect to /shop if not on step 3 (confirmation)
      if (step !== 3) {
        navigate('/shop');
      }
    }
  }, [cartItems, navigate, step]);

  useEffect(() => {
    if (error) {
      scrollToSection('error-message');
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');

    setError(null);
    if (path.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [path[0]]: { ...prev[path[0]], [path[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyCoupon = async () => {
    setCouponLoading(true);
    setError(null);

    if (formData.coupon.code.toUpperCase() === 'FREESHIPPING') {
      setFormData((prev) => ({
        ...prev,
        shippingMethod: { ...prev.shippingMethod, cost: 0 },
        coupon: { code: 'FREESHIPPING', discount: prev.shippingMethod.cost },
      }));
      toast.success('Coupon applied: Free shipping!');
    } else - setError('Invalid coupon code');
    setFormData((prev) => ({
      ...prev,
      shippingMethod: { ...prev.shippingMethod, cost: subtotal >= 800 ? 0 : subtotal >= 500 ? 50 : 80 },
      coupon: { code: prev.coupon.code, discount: 0 },
    }));
    setCouponLoading(false);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const { customer, shippingAddress } = formData;

    if (!cartItems.length) {
      setError('Your cart is empty');
      return;
    }
    if (!customer.firstName || !customer.lastName) {
      setError('Please enter your full name');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!/^[0-9]{10}$/.test(customer.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }
    if (!shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state) {
      setError('Please fill all required shipping address fields');
      return;
    }

    setError(null);
    setStep(2);
  };

  const markOrderAsFailed = async (orderId) => {
    try {
      await withRetry(() =>
        axios.post(
          `${BACKEND_URL}/api/orders/mark-failed`,
          { orderId },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        )
      );
      console.log(`Marked order as failed: ${orderId}`);
    } catch (error) {
      console.error(`Failed to mark order ${orderId} as failed:`, error.message);
    }
  };

  const downloadOrderPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Invoice: ${order.orderId || 'N/A'}`, 14, 20);
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 14, 28);

      doc.setFontSize(12);
      doc.text('Customer Information', 14, 40);
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
      doc.text('Shipping Details', 14, shippingY);
      const shippingBody = [['Address Line 1', order.shippingAddress?.address1 || 'N/A']];
      if (order.shippingAddress?.address2) {
        shippingBody.push(['Address Line 2', order.shippingAddress.address2]);
      }
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
      doc.text('Items Purchased', 14, itemsY);
      autoTable(doc, {
        startY: itemsY + 5,
        head: [['Item Name', 'Qty', 'Unit Price (₹)', 'Total (₹)']],
        body: (order.items || []).map((item) => [
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
          [
            'Grand Total',
            (order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('INR', '₹'),
          ],
        ],
        styles: { fontSize: 11, cellPadding: 3, fontStyle: 'bold', halign: 'right' },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } },
      });

      let paymentY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text('Payment Information', 14, paymentY);
      const paymentBody = [['Payment Method', order.paymentMethod || 'N/A']];
      if (order.paymentMethod !== 'COD' && order.paymentId) {
        paymentBody.push(['Payment ID', order.paymentId], ['Status', 'Paid']);
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
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || '',
      }));

      const shippingCost = formData.shippingMethod.cost;
      const total = subtotal + shippingCost;

      const orderData = {
        ...formData,
        items,
        date: new Date().toISOString(),
        total,
        paymentStatus: 'Pending',
      };

      const orderResponse = await withRetry(() =>
        axios.post(`${BACKEND_URL}/api/orders`, orderData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );

      if (!orderResponse.data.order?.orderId) {
        throw new Error('Order creation failed: Missing orderId');
      }

      setOrder(orderResponse.data.order);

      if (formData.paymentMethod === 'Razorpay') {
        try {
          const razorpayPayload = {
            orderId: orderResponse.data.order.orderId,
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: `receipt_${orderResponse.data.order.orderId}`,
            customer: {
              name: `${formData.customer.firstName} ${formData.customer.lastName}`,
              email: formData.customer.email,
              contact: formData.customer.phone,
            },
          };

          console.log('Razorpay Payload:', JSON.stringify(razorpayPayload, null, 2));

          const razorpayResponse = await withRetry(() =>
            axios.post(`${BACKEND_URL}/api/orders/initiate-razorpay-payment`, razorpayPayload, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 15000,
            })
          );

          const { razorpayOrderId, keyId } = razorpayResponse.data;

          if (!razorpayOrderId || !keyId) {
            throw new Error('Invalid Razorpay response: Missing orderId or keyId');
          }

          localStorage.setItem(
            'pendingTransaction',
            JSON.stringify({
              orderId: orderResponse.data.order.orderId,
              razorpayOrderId,
              timestamp: Date.now(),
            })
          );

          const options = {
            key: keyId,
            amount: total * 100,
            currency: 'INR',
            name: 'NISARGMAITRI',
            description: `Order #${orderResponse.data.order.orderId}`,
            order_id: razorpayOrderId,
            handler: async function (response) {
              try {
                console.log('Razorpay payment response:', response);
                localStorage.setItem(
                  'paymentCallbackData',
                  JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: orderResponse.data.order.orderId,
                  })
                );
                window.location.href = `${FRONTEND_URL}/payment-callback`;
              } catch (error) {
                console.error('Razorpay handler error:', error);
                await markOrderAsFailed(orderResponse.data.order.orderId);
                setError('Payment processing failed. Please try again.');
                setStep(2);
                setLoading(false);
              }
            },
            prefill: {
              name: `${formData.customer.firstName} ${formData.customer.lastName}`,
              email: formData.customer.email,
              contact: formData.customer.phone,
            },
            theme: { color: '#1A3329' },
            modal: {
              ondismiss: async function () {
                await markOrderAsFailed(orderResponse.data.order.orderId);
                setError('Payment was cancelled. Please try again.');
                setStep(2);
                setLoading(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', async function (response) {
            console.error('Razorpay payment failed:', response.error);
            await markOrderAsFailed(orderResponse.data.order.orderId);
            setError(`Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`);
            setStep(2);
            setLoading(false);
          });
          rzp.open();
        } catch (paymentError) {
          console.error('Razorpay payment initiation failed:', paymentError.response?.data || paymentError.message);
          await markOrderAsFailed(orderResponse.data.order.orderId);
          setError(
            paymentError.response?.data?.message ||
              'Failed to initiate Razorpay payment. Please try again or select Cash on Delivery.'
          );
          setStep(2);
        }
      } else if (formData.paymentMethod === 'COD') {
        setStep(3);
      }
    } catch (error) {
      console.error('Order processing failed:', error.response?.data || error.message);
      setError(
        error.response?.data?.error ||
          error.response?.data?.details ||
          'Something went wrong while processing your order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => navigate('/shop');

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

  const shippingCost = formData.shippingMethod.cost;
  const total = subtotal + shippingCost;

  const indianStates = [
    'Andaman and Nicobar Islands',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ].sort();

  const filteredStates = indianStates.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const PaymentCallback = () => {
    useEffect(() => {
      const verifyPayment = async () => {
        const callbackData = JSON.parse(localStorage.getItem('paymentCallbackData'));
        const pendingTransaction = JSON.parse(localStorage.getItem('pendingTransaction'));

        if (
          !callbackData ||
          !callbackData.razorpay_payment_id ||
          !callbackData.razorpay_order_id ||
          !callbackData.razorpay_signature ||
          !callbackData.orderId ||
          !pendingTransaction ||
          pendingTransaction.razorpayOrderId !== callbackData.razorpay_order_id ||
          pendingTransaction.orderId !== callbackData.orderId
        ) {
          await markOrderAsFailed(callbackData?.orderId || pendingTransaction?.orderId);
          setError('Invalid or missing transaction data. Please try again.');
          localStorage.removeItem('paymentCallbackData');
          localStorage.removeItem('pendingTransaction');
          setStep(2);
          navigate('/checkout', { state: { step: 2, cartItems } });
          return;
        }

        const transactionAge = Date.now() - pendingTransaction.timestamp;
        if (transactionAge > 15 * 60 * 1000) {
          await markOrderAsFailed(callbackData.orderId);
          setError('Transaction expired. Please initiate a new payment.');
          localStorage.removeItem('paymentCallbackData');
          localStorage.removeItem('pendingTransaction');
          setStep(2);
          navigate('/checkout', { state: { step: 2, cartItems } });
          return;
        }

        try {
          setLoading(true);
          const response = await withRetry(() =>
            axios.post(
              `${BACKEND_URL}/api/orders/verify-razorpay-payment`,
              {
                orderId: callbackData.orderId,
                razorpay_payment_id: callbackData.razorpay_payment_id,
                razorpay_order_id: callbackData.razorpay_order_id,
                razorpay_signature: callbackData.razorpay_signature,
              },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
              }
            )
          );

          if (response.data.success) {
            setOrder(response.data.order);
            setStep(3);
            localStorage.removeItem('paymentCallbackData');
            localStorage.removeItem('pendingTransaction');
            navigate('/checkout', {
              state: { order: response.data.order, step: 3, cartItems: [] }, // Clear cartItems to prevent redirect
            });
          } else {
            await markOrderAsFailed(callbackData.orderId);
            setError(response.data.error || 'Payment verification failed. Please contact support.');
            localStorage.removeItem('paymentCallbackData');
            localStorage.removeItem('pendingTransaction');
            setStep(2);
            navigate('/checkout', { state: { step: 2, cartItems } });
          }
        } catch (error) {
          console.error('Payment verification error:', error.response?.data || error.message);
          await markOrderAsFailed(callbackData.orderId);
          setError(
            error.response?.data?.error ||
              error.response?.data?.details ||
              'Payment verification error. Please try again or contact support.'
          );
          localStorage.removeItem('paymentCallbackData');
          localStorage.removeItem('pendingTransaction');
          setStep(2);
          navigate('/checkout', { state: { step: 2, cartItems } });
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    }, []);

    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Verifying Payment...</h2>
        <p>Please wait while we confirm your payment.</p>
        {loading && (
          <svg
            className="animate-spin h-8 w-8 mx-auto mt-4 text-[#1A3329]"
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
        )}
      </div>
    );
  };

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => {
      setError('Failed to load Razorpay SDK. Please try again or select Cash on Delivery.');
      setStep(2);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (location.pathname === '/payment-callback') {
    return <PaymentCallback />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <header className="bg-[#1A3329] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NISARGMAITRI</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm hover:underline"
            aria-label="Continue Shopping"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl flex items-center">
            <div
              className={`flex flex-col items-center ${step >= 1 ? 'text-[#1A3329]' : 'text-gray-400'}`}
              aria-current={step === 1 ? 'step' : undefined}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 1 ? 'bg-[#1A3329] text-white border-[#1A3329]' : 'border-gray-300'
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Information</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-[#1A3329]' : 'bg-gray-300'}`}></div>
            <div
              className={`flex flex-col items-center ${step >= 2 ? 'text-[#1A3329]' : 'text-gray-400'}`}
              aria-current={step === 2 ? 'step' : undefined}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 2 ? 'bg-[#1A3329] text-white border-[#1A3329]' : 'border-gray-300'
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-[#1A3329]' : 'bg-gray-300'}`}></div>
            <div
              className={`flex flex-col items-center ${step >= 3 ? 'text-[#1A3329]' : 'text-gray-400'}`}
              aria-current={step === 3 ? 'step' : undefined}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step >= 3 ? 'bg-[#1A3329] text-white border-[#1A3329]' : 'border-gray-300'
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {error && (
            <div id="error-message" className="mb-6 p-4 bg-red-100 text-red-700 rounded-md" role="alert">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Billing Information
                </h2>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
                        First Name*
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="customer.firstName"
                        value={formData.customer.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
                        Last Name*
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="customer.lastName"
                        value={formData.customer.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="customer.email"
                      value={formData.customer.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
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
                      title="10 digit phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      aria-required="true"
                      aria-describedby="phone-desc"
                    />
                    <p id="phone-desc" className="text-xs text-gray-500 mt-1">
                      Enter a 10-digit phone number
                    </p>
                  </div>

                  <div>
                    <label htmlFor="address1" className="block text-gray-700 text-sm font-medium mb-2">
                      Address Line 1*
                    </label>
                    <input
                      id="address1"
                      type="text"
                      name="shippingAddress.address1"
                      value={formData.shippingAddress.address1}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="address2" className="block text-gray-700 text-sm font-medium mb-2">
                      Address Line 2
                    </label>
                    <input
                      id="address2"
                      type="text"
                      name="shippingAddress.address2"
                      value={formData.shippingAddress.address2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">
                        State*
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={stateSearch}
                        onChange={handleStateSearch}
                        onFocus={() => setShowStateSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
                        placeholder="Search state"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                        aria-required="true"
                        aria-autocomplete="list"
                        aria-controls="state-suggestions"
                      />
                      {showStateSuggestions && stateSearch && (
                        <ul
                          id="state-suggestions"
                          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg"
                          role="listbox"
                        >
                          {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                              <li
                                key={state}
                                onClick={() => selectState(state)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                      <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                        City*
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-gray-700 text-sm font-medium mb-2">
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
                        title="6 digit pincode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                        aria-required="true"
                        aria-describedby="pincode-desc"
                      />
                      <p id="pincode-desc" className="text-xs text-gray-500 mt-1">
                        Enter a 6-digit pincode
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">GST Details (Optional)</h3>
                    <div>
                      <label htmlFor="gstNumber" className="block text-gray-700 text-sm font-medium mb-2">
                        GST Number
                      </label>
                      <input
                        id="gstNumber"
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
                      className="w-full sm:w-auto bg-[#1A3329] text-white px-8 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      Continue to Payment
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="w-full sm:w-auto bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                      disabled={loading}
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </section>

              <aside className="bg-white rounded-lg shadow-md p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm text-gray-800 font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-1">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Payment Method
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset className="space-y-4">
                    <legend className="sr-only">Payment Method</legend>
                    <label
                      className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={formData.paymentMethod === 'Razorpay'}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-[#1A3329]"
                        id="payment-razorpay"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900">Razorpay</span>
                        <span className="block text-sm text-gray-500">
                          Pay using Razorpay (UPI, Cards, Netbanking, etc.)
                        </span>
                      </div>
                    </label>

                    <label
                      className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-[#1A3329]"
                        id="payment-cod"
                      />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900">Cash on Delivery</span>
                        <span className="block text-sm text-gray-500">
                          Pay when you receive your order
                        </span>
                      </div>
                    </label>
                  </fieldset>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`order-2 sm:order-1 flex-1 bg-[#1A3329] text-white px-6 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="order-1 sm:order-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                      disabled={loading}
                    >
                      Back to Billing
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="order-3 sm:order-3 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300 font-medium"
                      disabled={loading}
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              </section>

              <aside className="bg-white rounded-lg shadow-md p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-start">
                        <span className="text-sm text-gray-800 font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-1">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="coupon-section mt-4 mb-4 py-3 border-y border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Apply Coupon</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={formData.coupon.code}
                      onChange={(e) =>
                        handleChange({
                          target: { name: 'coupon.code', value: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329] focus:border-transparent"
                      aria-label="Coupon code"
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className={`bg-[#1A3329] text-white px-3 py-2 rounded-md hover:bg-[#2F6844] transition-colors duration-300 text-sm ${
                        couponLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={couponLoading}
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
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
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Free shipping applied! (Discount: ₹{formData.coupon.discount})
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {step === 3 && order && (
            <section className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Thank You for Your Order!</h2>
                <p className="text-gray-600 mt-1">Your order has been confirmed and will be shipped soon.</p>
                <p className="text-gray-800 font-medium mt-2">
                  Order ID: <span className="font-bold">{order.orderId}</span>
                </p>
                {order.paymentMethod === 'Razorpay' && order.paymentId && (
                  <p className="text-gray-800 font-medium mt-1">
                    Payment ID: <span className="font-bold">{order.paymentId}</span>
                  </p>
                )}
                <button
                  onClick={() => downloadOrderPDF(order)}
                  className="mt-4 bg-[#1A3329] text-white px-6 py-2 rounded-md hover:bg-[#2F6844] transition-colors duration-300 flex items-center mx-auto"
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
                  Download Invoice
                </button>
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <p className="text-gray-800">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-gray-600">{order.customer.email}</p>
                  <p className="text-gray-600">{order.customer.phone}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Details</h3>
                  <p className="text-gray-800">{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p className="text-gray-800">{order.shippingAddress.address2}</p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">Shipping Method: {order.shippingMethod.type}</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    localStorage.removeItem('checkoutState');
                    navigate('/');
                  }}
                  className="bg-[#1A3329] text-white px-8 py-3 rounded-md hover:bg-[#2F6844] transition-colors duration-300 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;