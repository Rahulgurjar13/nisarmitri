import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar'; // Import the Navbar component
import Footer from './Footer';

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? 'translateY(-5px)' : 'none' }}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        {product.tag && (
          <div className="absolute top-4 right-4 bg-[#1A3329] text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.tag}
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-gray-900 font-semibold text-xl mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-[#1A3329] font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, visible, onClose }) => (
  visible && (
    <div className="fixed bottom-6 right-6 bg-[#1A3329] text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 z-50">
      <span>{message}</span>
      <button onClick={onClose} className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
);

// Cart Icon Component
const CartIcon = ({ itemCount, onClick }) => (
  <div className="relative cursor-pointer" onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-[#1A3329] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </div>
);

// Filter and Sort Options Component
const FilterOptions = ({ onSortChange, activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Bamboo', 'Steel', 'Menstrual', 'Zero Waste'];
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          {filters.map(filter => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeFilter === filter 
                ? 'bg-[#1A3329] text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div>
          <select 
            onChange={e => onSortChange(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
          >
            <option value="default">Sort By</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Shopping Cart Drawer Component
const CartDrawer = ({ isOpen, onClose, cartItems, removeFromCart, updateQuantity, onCheckout }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-gray-600">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 bg-[#1A3329] text-white px-4 py-2 rounded-md hover:bg-[#2F6844] transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-gray-900 font-medium">{item.name}</h3>
                    <p className="text-gray-600 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">Calculated at checkout</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-2xl text-gray-900 font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#1A3329] text-white py-3 rounded-lg font-medium hover:bg-[#2F6844] transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Shop Page Component
const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const productData = [
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
        id: 2,
        name: 'Bamboo Tongue Cleaner',
        description: 'Natural bamboo tongue cleaner for improved oral hygiene.',
        price: 99,
        image: '/tongue_cleaner.png',
        category: 'Bamboo'
      },
      {
        id: 3,
        name: 'Bamboo Razor',
        description: 'Sustainable bamboo razor with replaceable stainless steel blades.',
        price: 349,
        image: '/BAmboo (2).png',
        category: 'Bamboo'
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
        id: 5,
        name: 'Bamboo Straws (Set of 6)',
        description: 'Reusable bamboo drinking straws with cleaning brush included.',
        price: 199,
        image: '/BAmboo (1).png',
        category: 'Bamboo'
      },
      {
        id: 6,
        name: 'Steel Tumbler',
        description: 'Double-walled stainless steel tumbler for hot and cold beverages.',
        price: 699,
        image: '/tumbler.png',
        category: 'Steel'
      },
      {
        id: 7,
        name: 'Reusable Makeup Remover Pads',
        description: 'Soft cotton reusable makeup remover pads with washing bag, pack of 8.',
        price: 249,
        image: '/BAmboo (2).png',
        category: 'Zero Waste'
      },
      {
        id: 8,
        name: 'Steel Water Bottle',
        description: 'Stainless steel water bottle with leak-proof lid, 750ml capacity.',
        price: 799,
        image: '/Untitled design (35).png',
        category: 'Steel',
        tag: 'New'
      },
      {
        id: 9,
        name: 'Handmade Customized Muffler',
        description: 'Handcrafted muffler made from recycled cotton, can be customized.',
        price: 499,
        image: '/mufflers.png',
        category: 'Zero Waste'
      },
      {
        id: 10,
        name: 'Zero Waste Cutlery Set',
        description: 'Portable bamboo cutlery set with knife, fork, spoon, chopsticks and straw in cotton pouch.',
        price: 399,
        image: '/cutlery_set.png',
        category: 'Zero Waste'
      }
    ];
    
    setTimeout(() => {
      setProducts(productData);
      setLoading(false);
    }, 800);
  }, []);
  
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    setToast({ message: `${product.name} added to cart!`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems: cart } });
    setIsCartOpen(false);
  };
  
  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter);
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop All Products</h2>
          <CartIcon itemCount={totalCartItems} onClick={() => setIsCartOpen(true)} />
        </div>
        
        <FilterOptions 
          onSortChange={setSortOption} 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
        />
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
                <div className="bg-gray-300 h-64 w-full"></div>
                <div className="p-6">
                  <div className="bg-gray-300 h-6 w-3/4 mb-4"></div>
                  <div className="bg-gray-300 h-4 w-full mb-2"></div>
                  <div className="bg-gray-300 h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        )}
      </div>
      
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleBackdropClick}
        ></div>
      )}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
      
      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={() => setToast({ message: '', visible: false })} 
      />
      <Footer></Footer>
    </div>
    
  );
};

export default ShopPage;