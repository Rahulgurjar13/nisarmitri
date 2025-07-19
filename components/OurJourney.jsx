import React, { useEffect, useRef } from 'react';

const OurJourney = () => {
  const plantRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-grow');
        }
      },
      { threshold: 0.2 }
    );

    if (plantRef.current) {
      observer.observe(plantRef.current);
    }

    return () => {
      if (plantRef.current) {
        observer.unobserve(plantRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">Our Journey</h2>
          <div className="w-16 sm:w-24 h-1 bg-[#2F6844] mx-auto"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          {/* Visual element - More attractive and original animation */}
          <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0">
            <div className="relative w-full max-w-md">
              {/* Dynamic background */}
              <div className="bg-gradient-to-br from-[#2F6844] to-[#1A3329] rounded-3xl sm:rounded-[40px] h-[400px] sm:h-[500px] w-full relative overflow-hidden shadow-xl">
                {/* Dynamic particle elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-[10%] left-[15%] w-12 h-12 rounded-full bg-white opacity-10 animate-float1"></div>
                  <div className="absolute top-[30%] right-[20%] w-16 h-16 rounded-full bg-white opacity-10 animate-float2"></div>
                  <div className="absolute bottom-[25%] left-[25%] w-8 h-8 rounded-full bg-white opacity-10 animate-float3"></div>
                  <div className="absolute top-[60%] right-[15%] w-10 h-10 rounded-full bg-white opacity-10 animate-float4"></div>
                </div>

                {/* Animated ecosystem illustration */}
                <div ref={plantRef} className="absolute w-full h-full flex items-center justify-center transition-all duration-1000 opacity-0" style={{transform: 'translateY(40px)'}}>
                  {/* Earth base */}
                  <div className="absolute bottom-0 w-full h-1/4 bg-[#4D7C6F] rounded-tl-full rounded-tr-full"></div>
                  
                  {/* Plant group with staggered animation */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xs flex justify-center">
                    {/* Plant 1 - Left */}
                    <div className="relative mx-2">
                      <div className="w-2 h-32 sm:h-40 bg-[#5A9E78] origin-bottom animate-sway-slow">
                        <div className="absolute -left-6 top-4 w-8 h-10 bg-[#76BC94] rounded-full transform -rotate-45"></div>
                        <div className="absolute -right-6 top-12 w-8 h-10 bg-[#76BC94] rounded-full transform rotate-45"></div>
                        <div className="absolute -top-6 -left-3 w-8 h-8 bg-[#FFB845] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Plant 2 - Center */}
                    <div className="relative mx-2">
                      <div className="w-2 h-48 sm:h-64 bg-[#4D8D6E] origin-bottom animate-sway-medium">
                        <div className="absolute -left-8 top-6 w-10 h-14 bg-[#6AAF8D] rounded-tl-full rounded-bl-full transform rotate-45"></div>
                        <div className="absolute -right-8 top-20 w-10 h-14 bg-[#6AAF8D] rounded-tr-full rounded-br-full transform -rotate-45"></div>
                        <div className="absolute -left-10 top-36 w-12 h-16 bg-[#6AAF8D] rounded-tl-full rounded-bl-full transform rotate-45"></div>
                        <div className="absolute -top-10 -left-4 w-10 h-10 bg-[#FF8866] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Plant 3 - Right */}
                    <div className="relative mx-2">
                      <div className="w-2 h-40 sm:h-52 bg-[#5A9E78] origin-bottom animate-sway-fast">
                        <div className="absolute -right-7 top-8 w-9 h-12 bg-[#76BC94] rounded-full transform rotate-45"></div>
                        <div className="absolute -left-7 top-20 w-9 h-12 bg-[#76BC94] rounded-full transform -rotate-45"></div>
                        <div className="absolute -top-8 -left-4 w-10 h-10 bg-[#AED888] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Water droplets */}
                  <div className="absolute top-10 left-1/4 w-3 h-6 bg-[#A6D8F2] rounded-b-full animate-water-drop1"></div>
                  <div className="absolute top-6 right-1/3 w-2 h-4 bg-[#A6D8F2] rounded-b-full animate-water-drop2"></div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#4D7C6F] opacity-20 rounded-full blur-md hidden sm:block"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#4D7C6F] opacity-20 rounded-full blur-md hidden sm:block"></div>
            </div>
          </div>
          
          {/* Content side - Enhanced for mobile */}
          <div className="w-full lg:w-1/2 space-y-6 px-4 sm:px-0">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#2F6844] mb-4 font-serif">NISARG MAITRI</h3>
              <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
                Connecting people with nature for a sustainable future. We promote eco-friendly practices and waste management solutions that preserve our planet for generations to come.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Poor waste management harms biodiversity and contributes to climate change. Our resources help individuals and communities reduce trash, encourage recycling, and embrace sustainable living.
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2F6844] bg-opacity-20 flex items-center justify-center text-[#2F6844]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Reduce waste</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2F6844] bg-opacity-20 flex items-center justify-center text-[#2F6844]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Recycle materials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2F6844] bg-opacity-20 flex items-center justify-center text-[#2F6844]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Community action</span>
                </div>
              </div>
            </div>
            
            <div className="text-center sm:text-left">
            
            </div>
          </div>
        </div>
      </div>
      
      {/* Add these animation keyframes to your global CSS or style tag */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes sway-slow {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes sway-medium {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes sway-fast {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes water-drop1 {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        @keyframes water-drop2 {
          0% { transform: translateY(-20px); opacity: 0; }
          30% { opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-float1 { animation: float1 6s infinite ease-in-out; }
        .animate-float2 { animation: float2 7s infinite ease-in-out; }
        .animate-float3 { animation: float3 8s infinite ease-in-out; }
        .animate-float4 { animation: float4 9s infinite ease-in-out; }
        .animate-sway-slow { animation: sway-slow 4s infinite ease-in-out; }
        .animate-sway-medium { animation: sway-medium 5s infinite ease-in-out; }
        .animate-sway-fast { animation: sway-fast 3s infinite ease-in-out; }
        .animate-water-drop1 { animation: water-drop1 10s infinite linear; }
        .animate-water-drop2 { animation: water-drop2 15s infinite linear 5s; }
        .animate-grow {
          opacity: 1;
          transform: translateY(0px);
        }
      `}</style>
    </section>
  );
};

export default OurJourney;