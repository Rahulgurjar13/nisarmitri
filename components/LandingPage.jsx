import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure this path is correct
import OurJourney from './OurJourney'; // Ensure this path is correct
import Footer from './Footer'; // Ensure this path is correct
import Chatbot from './Chatbot'; // Import the new Chatbot component

const LandingPage = () => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const navigate = useNavigate();

  const highlightedProducts = [
    {
      id: 1,
      name: 'Bamboo Toothbrush',
      description: 'Eco-friendly bamboo toothbrush with soft bristles, perfect for everyday use.',
      price: 40,
      image: '/toothbrush.png', // Ensure this image exists in the public folder
      category: 'Bamboo',
      tag: 'Bestseller',
    },
    {
      id: 4,
      name: 'Menstrual Cup',
      description: 'Reusable silicone menstrual cup, eco-friendly alternative to disposable products.',
      price: 299,
      image: '/cup.png', // Ensure this image exists in the public folder
      category: 'Menstrual',
      tag: 'Popular',
    },
    {
      id: 3,
      name: 'Bamboo Razor',
      description: 'Sustainable bamboo razor with replaceable stainless steel blades.',
      price: 199,
      image: '/BAmboo (2).png', // Ensure this image exists in the public folder
      category: 'Bamboo',
    },
  ];

  const handleBuyNow = (product) => {
    setToast({ message: `Proceeding to buy ${product.name}!`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Shop Eco-friendly <br />
            Products for a<br />
            Greener Planet
          </h1>
          <button
            onClick={() => navigate('/shop')}
            className="mt-6 sm:mt-10 bg-[#2F6844] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center mx-auto md:mx-0 w-fit hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#2F6844]"
            aria-label="Explore shop"
          >
            Explore Shop
            <span className="ml-2">
              <ArrowIcon />
            </span>
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/earth.png" // Ensure this image exists in the public folder
            alt="Illustration of eco-friendly products"
            className="max-w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain"
          />
        </div>
      </main>
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Featured Recycled Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {highlightedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              {product.tag && <ProductTag text={product.tag} />}
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-36 sm:h-48 object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-base sm:text-lg">₹{product.price.toLocaleString('en-IN')}</p>
              <button
                onClick={() => handleBuyNow(product)}
                className="mt-3 sm:mt-4 w-full bg-[#2F6844] text-white py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#2F6844]"
                aria-label={`Buy ${product.name}`}
              >
                Buy Now
                <span className="ml-2">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => navigate('/shop')}
            className="inline-block bg-[#2F6844] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#2F6844]"
            aria-label="View all products"
          >
            View All Products
          </button>
        </div>
      </section>
      <Chatbot />
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ message: '', visible: false })}
      />
      <OurJourney />
      <Footer />
    </div>
  );
};

// Supporting Components (KEEPING ORIGINAL EXACTLY AS IS)
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sm:w-5 sm:h-5"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);

const Toast = ({ message, visible, onClose }) => (
  <div
    className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#2F6844] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 max-w-[90vw] sm:max-w-md z-50 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    <span className="text-sm sm:text-base flex-1">{message}</span>
    <button
      onClick={onClose}
      className="text-white flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
      aria-label="Close toast"
    >
      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const ProductTag = ({ text }) => (
  <div className="absolute top-3 right-3 bg-[#2F6844] text-white text-xs rounded-full px-2 py-1">{text}</div>
);

export default LandingPage;