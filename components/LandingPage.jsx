import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OurJourney from './OurJourney';
import WasteManagement7Rs from './WasteManagement7Rs';
import Footer from './Footer';

// Arrow Icon for buttons
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);

// Toast Notification Component
const Toast = ({ message, visible, onClose }) => (
  visible && (
    <div className="fixed bottom-6 right-6 bg-[#1A3329] text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300">
      <span>{message}</span>
      <button onClick={onClose} className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
);

const LandingPage = () => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const navigate = useNavigate();

  const highlightedProducts = [
    {
      id: 1,
      name: 'Bamboo Toothbrush',
      description: 'Eco-friendly bamboo toothbrush with soft bristles, perfect for everyday use.',
      price: 149,
      image: '/toothbrush.png',
      category: 'Bamboo',
      tag: 'Bestseller'
    },
    {
      id: 4,
      name: 'Menstrual Cup',
      description: 'Reusable silicone menstrual cup, eco-friendly alternative to disposable products.',
      price: 599,
      image: '/cup.png',
      category: 'Menstrual',
      tag: 'Popular'
    },
    {
      id: 3,
      name: 'Bamboo Razor',
      description: 'Sustainable bamboo razor with replaceable stainless steel blades.',
      price: 349,
      image: '/BAmboo (2).png',
      category: 'Bamboo'
    }
  ];

  const handleBuyNow = (product) => {
    setToast({ message: `Proceeding to buy ${product.name}!`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
    // Optionally, navigate to a checkout or product page
    navigate('/shop'); // Adjust this to your desired route
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Use the updated Navbar component */}
      <Navbar />
      
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 relying-tight">
            Shop Recycled<br />
            Products for a<br />
            Greener India
          </h1>
          <Link 
            to="/shop" 
            className="mt-10 bg-[#1A3329] text-white px-8 py-4 rounded-lg font-medium flex items-center w-fit hover:bg-[#2F6844] transition-colors duration-300"
          >
            Explore Shop
            <span className="ml-2"><ArrowIcon /></span>
          </Link>
        </div>
        <div className="md:w-1/2 relative flex justify-center">
          <div className="rounded-full w-[300px] md:w-[500px] h-[300px] md:h-[500px] flex items-end justify-center overflow-hidden">
            <img 
              src="/tree1.png" 
              alt="Recycled product display" 
              className="h-full object-contain object-bottom"
            />
          </div>
        </div>
      </main>

      {/* Highlighted Products Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Featured Recycled Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlightedProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-lg">₹{product.price.toLocaleString('en-IN')}</p>
              <button 
                onClick={() => handleBuyNow(product)}
                className="mt-4 w-full bg-[#1A3329] text-white py-3 rounded-lg font-medium flex items-center justify-center hover:bg-[#2F6844] transition-colors duration-300"
              >
                Buy Now
                <span className="ml-2"><ArrowIcon /></span>
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link 
            to="/shop" 
            className="inline-block bg-[#1A3329] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2F6844] transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={() => setToast({ message: '', visible: false })} 
      />
      <OurJourney />
      <WasteManagement7Rs />
      <Footer />
    </div>
  );
};

export default LandingPage;