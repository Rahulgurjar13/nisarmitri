import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Category Card Component
const CategoryCard = ({ category, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-full cursor-pointer"
      onClick={() => onClick(category)}
    >
      <div className="relative overflow-hidden h-72">
        <img 
          src={category.image} 
          alt={category.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Removed the opacity overlay div that was here */}
      </div>
      <div className="p-5 text-center">
        <h3 className="text-[#1A3329] font-semibold text-xl">{category.title}</h3>
        <div className="mt-2 h-0.5 w-16 bg-[#2F6844] mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Click to learn more</p>
      </div>
    </div>
  );
};

// Modal Component for Category Details
const CategoryModal = ({ category, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-[#1A3329]">{category.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-116px)] scrollbar-thin">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="md:sticky md:top-6">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <div className="mt-6 p-4 bg-[#F5F9F7] border-l-4 border-[#2F6844] rounded-r-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-[#1A3329] mb-2">Quick Info</h3>
                  <p className="text-sm text-gray-600">Learn how to properly manage {category.title.toLowerCase()} to reduce environmental impact and promote sustainability.</p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: category.content }} />
              
              {category.tips && (
                <div className="mt-8 bg-[#F7FCFA] p-6 rounded-lg border border-[#CCEADB]">
                  <h3 className="text-xl font-semibold text-[#1A3329] mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#2F6844]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tips for Managing {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="flex items-start bg-white p-3 rounded-md shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2F6844] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#2F6844] text-white rounded-md hover:bg-[#1A3329] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6844] focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Waste Management Page Component
const WasteManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      // This would be your actual API call
      const wasteCategories = [
        {
          id: 1,
          title: "E-Waste",
          image: "https://images.yourstory.com/cs/5/98c65090592f11ea9f62339ce853ca75/Ewaste-1602590536972.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75",
          content: `
            <p>Electronic waste, or e-waste, refers to discarded electronic devices. These devices contain various toxic and hazardous materials like lead, mercury, cadmium, and brominated flame retardants that can harm human health and the environment if not properly managed.</p>
            <p>Recycling e-waste can recover valuable materials such as gold, silver, copper, and rare earth elements, reducing the need for mining and conserving natural resources.</p>
            <p>Many countries have established e-waste management systems and regulations to ensure proper collection, recycling, and disposal of electronic waste.</p>
          `,
          tips: [
            "Donate working electronics to schools, charities, or other organizations",
            "Return old devices to electronics retailers that offer take-back programs",
            "Use certified e-waste recyclers to ensure proper handling",
            "Remove and properly dispose of batteries before recycling electronic devices",
            "Consider repairing rather than replacing electronics when possible"
          ]
        },
        {
          id: 2,
          title: "Plastic Waste",
          image: "https://www.theparliamentmagazine.eu/siteimg/share/ugc-1/fullnews/news/15857/15047_original.jpg",
          content: `
            <p>Plastic waste is one of the most prevalent forms of pollution globally. Most plastics are non-biodegradable and can persist in the environment for hundreds of years.</p>
            <p>Only about 9% of all plastic waste ever produced has been recycled, while about 12% has been incinerated. The rest has accumulated in landfills, dumps, or the natural environment.</p>
            <p>Microplastics, tiny plastic particles less than 5mm in size, have been found throughout the environment, including in oceans, drinking water, and even human blood.</p>
          `,
          tips: [
            "Reduce single-use plastic consumption by using reusable alternatives",
            "Properly sort and clean plastics before recycling",
            "Choose products with minimal or recyclable packaging",
            "Support businesses that use sustainable packaging",
            "Participate in community clean-up events to remove plastic litter"
          ]
        },
        {
          id: 3,
          title: "Kitchen Waste",
          image: "https://kj1bcdn.b-cdn.net/media/40581/waste.jpg",
          content: `
            <p>Kitchen waste, or food waste, refers to uneaten food and food preparation scraps. Globally, about one-third of all food produced for human consumption is lost or wasted.</p>
            <p>When food waste ends up in landfills, it decomposes anaerobically and produces methane, a potent greenhouse gas that contributes to climate change.</p>
            <p>Composting kitchen waste can reduce methane emissions and create nutrient-rich soil amendment for gardens and agriculture.</p>
          `,
          tips: [
            "Plan meals and make shopping lists to avoid buying excess food",
            "Store food properly to extend its shelf life",
            "Use leftovers creatively in new dishes",
            "Compost fruit and vegetable scraps, coffee grounds, and eggshells",
            "Donate excess non-perishable food to local food banks"
          ]
        },
        {
          id: 4,
          title: "Medical Waste",
          image: "https://www.trihazsolutions.com/wp-content/uploads/2024/01/How-to-Dispose-of-Liquid-Medical-Waste.webp",
          content: `
            <p>Medical waste includes potentially infectious materials from healthcare facilities, laboratories, and medical research institutions. Proper disposal is crucial to prevent the spread of disease.</p>
            <p>Categories of medical waste include sharps (needles, scalpels), infectious waste, pathological waste, pharmaceutical waste, and radioactive waste.</p>
            <p>Different types of medical waste require different methods of disposal, such as autoclaving, incineration, or chemical treatment.</p>
          `,
          tips: [
            "Keep medical waste separate from regular household waste",
            "Use designated containers for sharps disposal",
            "Return unused medications to pharmacies with take-back programs",
            "Follow local regulations for disposal of home medical waste",
            "Never flush medications down the toilet or drain"
          ]
        },
        {
          id: 5,
          title: "Menstrual Waste",
          image: "https://media.istockphoto.com/id/1405060301/photo/the-hand-throws-sanitary-pads-into-the-trash-menstrual-pads-are-tossed-into-the-office.jpg?s=612x612&w=0&k=20&c=6y_E-_hO4pwAJBEatETw_w2iJn7jRkJc7LyIcS5ONq4=",
          content: `
            <p>Menstrual waste includes disposable sanitary napkins, tampons, and their packaging. These products often contain plastic materials that can take hundreds of years to degrade.</p>
            <p>A single person who menstruates might use between 5,000 and 15,000 disposable menstrual products in their lifetime, contributing significantly to landfill waste.</p>
            <p>Sustainable alternatives like menstrual cups, reusable cloth pads, and period underwear can significantly reduce menstrual waste and save money over time.</p>
          `,
          tips: [
            "Consider switching to reusable menstrual products",
            "Dispose of disposable products properly in waste bins, not toilets",
            "Choose biodegradable or organic cotton menstrual products when possible",
            "Carry a small bag for discreet disposal when public bins aren't available",
            "Educate others about sustainable menstrual practices"
          ]
        },
        {
          id: 6,
          title: "Zero Waste Celebrations",
          image: "https://www.sparkliv.in/cdn/shop/files/ZERO_WASTE_EAR-02_3c03d724-4490-49d8-b9b3-31c1c2f7916e.png?v=1721111373&width=1000",
          content: `
            <p>Traditional celebrations and events often generate significant waste through disposable decorations, single-use tableware, excess food, and gift wrapping.</p>
            <p>Zero waste celebrations focus on reducing waste by using reusable items, minimizing packaging, and planning thoughtfully.</p>
            <p>Implementing zero waste principles for celebrations not only reduces environmental impact but can also create more meaningful and intentional experiences.</p>
          `,
          tips: [
            "Use digital invitations instead of paper",
            "Decorate with reusable or compostable items like cloth bunting or potted plants",
            "Serve food on reusable dishes or compostable alternatives",
            "Use cloth napkins and tablecloths instead of disposable ones",
            "Consider experience gifts or secondhand items instead of new products"
          ]
        },
        {
          id: 7,
          title: "Domestic Waste",
          image: "https://protechgroup.in/wp/wp-content/uploads/2022/07/featured-1080x675.jpg",
          content: `
            <p>Domestic waste, or household waste, includes all waste generated in homes. This includes food waste, packaging, paper, plastics, glass, textiles, and more.</p>
            <p>The average person generates about 1.5 kg of waste per day, with significant variations between countries and regions.</p>
            <p>Proper waste segregation at the household level is crucial for effective recycling and waste management.</p>
          `,
          tips: [
            "Set up a home waste sorting system with separate bins for different types of waste",
            "Reduce paper waste by opting for electronic bills and communications",
            "Repurpose items like glass jars for storage before recycling",
            "Donate usable items instead of throwing them away",
            "Learn about your local recycling guidelines and follow them carefully"
          ]
        },
        {
          id: 8,
          title: "Zero Waste Travel",
          image: "https://i.pinimg.com/474x/27/0f/4d/270f4d80317664ba72951da9dc40af3d.jpg",
          content: `
            <p>Travel often involves increased consumption of single-use items like plastic water bottles, takeaway containers, and miniature toiletries.</p>
            <p>Zero waste travel focuses on minimizing waste while exploring new places by packing reusable alternatives and making mindful choices.</p>
            <p>Sustainable travel choices can reduce your environmental footprint while often enhancing your travel experience through more authentic connections with places and people.</p>
          `,
          tips: [
            "Pack a zero waste travel kit with reusable water bottle, utensils, and food containers",
            "Bring your own toiletries in refillable containers instead of using hotel miniatures",
            "Use digital tickets and maps instead of printed versions",
            "Choose accommodations with environmental practices",
            "Support local businesses that use sustainable practices"
          ]
        }
      ];
      
      setTimeout(() => {
        setCategories(wasteCategories);
        setLoading(false);
      }, 800);
    };
    
    fetchData();
  }, []);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-serif">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ways to Manage Waste</h1>
          <div className="w-32 h-1 bg-[#2F6844] mx-auto"></div>
          <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Learn about different types of waste and how to manage them effectively to reduce your environmental footprint and contribute to a healthier planet.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
                <div className="bg-gray-300 h-72 w-full"></div>
                <div className="p-4">
                  <div className="bg-gray-300 h-6 w-1/2 mx-auto rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(0, 4).map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onClick={handleCategoryClick} 
                />
              ))}
            </div>
            
            <div className="w-40 h-1 bg-[#2F6844] mx-auto my-16 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border-2 border-[#2F6844]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2F6844]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(4).map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onClick={handleCategoryClick} 
                />
              ))}
            </div>
          </>
        )}
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 italic">Click on any category to learn more about proper waste management practices.</p>
        </div>
      </div>
      
      {selectedCategory && (
        <CategoryModal 
          category={selectedCategory} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
      
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      
      <Footer />
    </div>
  );
};

export default WasteManagementPage;