import React, { useState } from 'react';

// Leaf Icon SVG Component
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7 2 4 7 4 12C4 17 7 22 12 22C17 22 20 17 20 12C20 7 17 2 12 2Z" fill="#1A3329"/>
    <path d="M7 5C9 3 15 7 15 11C15 15 11 17 7 15C3 13 5 7 7 5Z" fill="#2F6844"/>
  </svg>
);

const WasteManagementCard = ({ title, description, index, onClick, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer
        ${isActive ? 'border-2 border-[#1A3329]' : 'border border-transparent'}
        ${isHovered ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-center mb-4">
        <div className={`bg-[#1A3329] text-white w-14 h-14 rounded-full flex items-center justify-center
          ${isHovered ? 'transform rotate-12 transition-transform duration-300' : ''}`}>
          <span className="text-xl font-bold">R</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
};

const WasteManagement7Rs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const principles = [
    {
      title: "Rethink",
      description: "Consider how your choices impact the environment before making purchasing decisions.",
      fullDescription: "Rethink the way you view consumption. Question whether you truly need a product before buying it, and consider its environmental impact throughout its lifecycle."
    },
    {
      title: "Refuse",
      description: "Say no to single-use items and unnecessary packaging that ends up as waste.",
      fullDescription: "Refuse items that you don't need, especially single-use plastics. Choose products with minimal or eco-friendly packaging to reduce waste at its source."
    },
    {
      title: "Reduce",
      description: "Minimize consumption and choose products with less environmental impact.",
      fullDescription: "Reduce your overall consumption by buying less and choosing quality products that last longer. This decreases the resources needed for manufacturing and reduces waste."
    },
    {
      title: "Reuse",
      description: "Use items multiple times or repurpose them instead of disposing after single use.",
      fullDescription: "Reuse products and packaging instead of throwing them away. Get creative with repurposing items to extend their useful life and keep them out of landfills."
    },
    {
      title: "Recycle",
      description: "Transform waste materials into new products to conserve resources.",
      fullDescription: "Recycle materials properly so they can be processed into new products. Learn your local recycling guidelines and follow them carefully to ensure effective recycling."
    },
    {
      title: "Recover",
      description: "Extract energy or materials from waste that cannot be recycled.",
      fullDescription: "Recover energy from waste through processes like composting, which converts organic waste into nutrient-rich soil, or through waste-to-energy technologies."
    },
    {
      title: "Rot",
      description: "Compost organic waste to create nutrient-rich soil for growing plants.",
      fullDescription: "Rot organic waste through composting to create valuable fertilizer for plants. This diverts food scraps and yard waste from landfills while creating a useful resource."
    }
  ];

  const toggleActive = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="bg-gray-50 py-16 px-6 font-serif">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The 7 R's of Waste Management</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple principles to adopt in your daily life that can make a significant 
            impact on reducing waste and preserving our environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {principles.map((principle, index) => (
            <WasteManagementCard 
              key={index} 
              title={principle.title} 
              description={principle.description}
              index={index}
              onClick={() => toggleActive(index)}
              isActive={activeIndex === index}
            />
          ))}
        </div>
        
        {activeIndex !== null && (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-[#1A3329] text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <LeafIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{principles[activeIndex].title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {principles[activeIndex].fullDescription}
            </p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveIndex(null)}
                className="text-[#1A3329] font-medium flex items-center hover:text-[#2F6844] transition-colors duration-300"
              >
                Close
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <a 
            href="/sustainable-practices" 
            className="inline-block bg-[#1A3329] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2F6844] transition-colors duration-300 flex items-center justify-center mx-auto w-fit"
          >
            Learn More About Sustainable Practices
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WasteManagement7Rs;