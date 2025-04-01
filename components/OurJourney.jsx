import React from 'react';

const OurJourney = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left side - Plant image with arch background */}
        <div className="md:w-1/2 relative mb-10 md:mb-0">
          <div className="bg-[#1A3329] w-full h-[500px] rounded-t-[300px] relative overflow-hidden">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <img 
                src="/public/logo.png" 
                alt="Monstera plant in white pot" 
                className="object-contain h-[580px]"
              />
            </div>
          </div>
          
          <div className="absolute -top-10 -left-10 opacity-60 hidden md:block">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10C40 30 30 60 60 80C90 100 100 50 60 10Z" fill="#4D7C6F" fillOpacity="0.3"/>
            </svg>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-60 hidden md:block">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 110C40 90 30 60 60 40C90 20 100 70 60 110Z" fill="#4D7C6F" fillOpacity="0.3"/>
            </svg>
          </div>
        </div>
        
        {/* Right side - Text content */}
        <div className="md:w-1/2 md:pl-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-8 font-serif">Our Journey</h2>
          
          <div className="text-gray-700 text-lg leading-relaxed mb-8">
            <h3 className="text-2xl font-semibold mb-4">NISARGMAITRI</h3>
            <p className="mb-4">
              Connecting people with nature for a sustainable future. We promote eco-friendly practices and waste management.
            </p>
            <p>
              Poor waste management harms biodiversity and contributes to climate change. Our resources help reduce trash and encourage recycling.
            </p>
          </div>
          
          <a 
            href="#" 
            className="inline-flex items-center border border-[#1A3329] text-[#1A3329] font-medium px-8 py-3 rounded-full"
          >
            Get Started 
            <svg 
              className="ml-2" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M14 5L21 12M21 12L14 19M21 12H3" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurJourney;