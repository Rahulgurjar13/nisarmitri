import { useState } from "react";

export default function PhonePePaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/pay', { method: 'POST' });
      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // Redirect to PhonePe
      } else {
        alert('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">PhonePe Payment Gateway Test</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition duration-300 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay with PhonePe'}
      </button>
    </div>
  );
}
