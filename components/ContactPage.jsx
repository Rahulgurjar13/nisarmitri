import React, { useState, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const getApiUrl = () => import.meta.env.VITE_API_URL || "https://backendforshop.onrender.com";

const Toast = ({ message, visible, onClose, type = "success" }) =>
  visible && (
    <div
      className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );

const SuccessMessage = ({ onReset }) => (
  <div className="text-center py-16 px-8 flex-grow flex items-center justify-center">
    <div>
      <div className="flex justify-center">
        <div className="bg-green-100 p-4 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#2F6844]"
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
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mt-6">Thank You!</h2>
      <p className="text-gray-600 mt-4 text-lg">
        Your message has been sent successfully. We'll get back to you soon.
      </p>
      <button
        onClick={onReset}
        className="mt-8 bg-[#1A3329] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2F6844] transition-colors duration-300 shadow-md"
      >
        Send Another Message
      </button>
    </div>
  </div>
);

const ContactForm = ({
  formData,
  errors,
  loading,
  handleInputChange,
  handleSubmit,
}) => (
  <div className="flex flex-col flex-grow">
    <div className="bg-[#1A3329] py-6 px-8">
      <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
      <p className="text-green-100 mt-2">
        Fill out the form below and we'll respond as soon as possible
      </p>
    </div>
    <form onSubmit={handleSubmit} className="p-8 flex-grow flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6844] transition-all`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="col-span-1">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6844] transition-all`}
            placeholder="Your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="col-span-1">
          <label
            htmlFor="phone"
            className="block text-gray-700 font-medium mb-2"
          >
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6844] transition-all"
            placeholder="Your phone number"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="subject"
            className="block text-gray-700 font-medium mb-2"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6844] transition-all"
            placeholder="What is this regarding?"
          />
        </div>
      </div>

      <div className="mt-6 flex-grow">
        <label
          htmlFor="message"
          className="block text-gray-700 font-medium mb-2"
        >
          Message*
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows="5"
          className={`w-full px-4 py-3 border ${
            errors.message ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6844] transition-all h-full`}
          placeholder="Your message here..."
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-[#1A3329] text-white py-3 rounded-lg font-medium hover:bg-[#2F6844] transition-colors duration-300 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          <>
            <span>Send Message</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  </div>
);

const FAQCard = ({ faqItems }) => (
  <div className="bg-white shadow-xl rounded-xl p-8 h-full flex flex-col">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6 flex-grow">
      {faqItems.map((faq, index) => (
        <div key={index} className="border-b pb-4 last:border-b-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {faq.question}
          </h3>
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

const ContactPage = () => {
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const token = localStorage.getItem("token");
  const handleCloseToast = useCallback(() => {
    setToast({ message: "", visible: false, type: toast.type });
  }, [toast.type]);

  const handleApiError = (error, operation) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error || `Failed to ${operation}. Please try again.`;
    console.error(`${operation} error:`, status, message);

    if (status === 401 || status === 403) {
      setToast({
        message: "Session expired or unauthorized. Please log in again.",
        visible: true,
        type: "error",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userName");
      setTimeout(handleCloseToast, 5000);
      return { message };
    }
    return { message };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${getApiUrl()}/api/contact`,
          formData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setFormSubmitted(true);
        setToast({
          message:
            response.data.message || "Your message has been sent successfully!",
          visible: true,
          type: "success",
        });
        setTimeout(handleCloseToast, 5000);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } catch (error) {
        const { message } = handleApiError(error, "submit contact form");
        setToast({ message, visible: true, type: "error" });
        setTimeout(handleCloseToast, 5000);
        setErrors(error.response?.data?.errors || {});
      } finally {
        setLoading(false);
      }
    }
  };

  const faqItems = [
    {
      question: "What types of recycled products do you offer?",
      answer:
        "We offer a wide range of products made from recycled materials, including home decor, stationery, fashion accessories, and eco-friendly lifestyle products.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking number via email. You can use this to track your package on our website or through the couriers site.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 14 days of delivery. Items must be unused and in original packaging. Please contact our customer service team to initiate a return.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship within India only. We plan to expand our shipping options to international destinations in the near future.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <Navbar />
      <div className="bg-[#1A3329] text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl">
            We'd love to hear from you. Reach out with any questions or feedback
            and our team will get back to you as soon as possible.
          </p>
        </div>
      </div>
      <section className="container mx-auto px-6 py-16" id="contact-form">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden h-full flex flex-col">
              {formSubmitted ? (
                <SuccessMessage onReset={() => setFormSubmitted(false)} />
              ) : (
                <ContactForm
                  formData={formData}
                  errors={errors}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <FAQCard faqItems={faqItems} />
          </div>
        </div>
      </section>
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={handleCloseToast}
        type={toast.type}
      />
      <Footer />
    </div>
  );
};

export default ContactPage;