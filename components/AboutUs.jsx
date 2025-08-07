import React, { useState, useEffect } from 'react';
import { Play, Award, Users, Leaf, ChevronRight, Clock, Heart, Eye } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Fallback image for founder if local image fails
const FALLBACK_IMAGE = 'https://via.placeholder.com/150?text=Founder';

// Milestone component
const Milestone = ({ year, title, description }) => (
  <div className="relative pl-6 sm:pl-8 md:pl-10 pb-6 md:pb-8 border-l-4 border-[#2A5446] last:pb-0">
    <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#1D3B30] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg">
      <Leaf size={12} className="sm:w-4 md:w-5" />
    </div>
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <span className="inline-block bg-[#E6F0ED] text-[#1D3B30] px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-2">{year}</span>
      <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

// Featured Video component
const FeaturedVideo = ({ title, description, videoId, thumbnail, likes, views }) => {
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Robust video ID cleaning
  const cleanVideoId = (id) => {
    try {
      return id.split('?')[0].split('/').pop() || id;
    } catch {
      return id;
    }
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative aspect-video bg-gray-900">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${cleanVideoId(videoId)}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : (
          <>
            <img 
              src={thumbnail || 'https://via.placeholder.com/640x360?text=Video+Thumbnail'} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail'; }}
            />
            <div className={`absolute inset-0 bg-[#1D3B30] transition-all duration-500 ${hovering ? 'opacity-2' : 'opacity-90'}`}></div>
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="bg-white text-[#1D3B30] w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg mb-2">
                <Play size={16} fill="#1D3B30" className="sm:w-5 md:w-6" />
              </div>
              <h3 className="text-white text-sm sm:text-base md:text-lg font-bold mt-2 text-center px-4">{title}</h3>
              <span className="bg-white bg-opacity-90 text-[#1D3B30] px-2 py-1 rounded-md text-xs font-medium shadow-md mt-2">
                Watch Now
              </span>
            </button>
          </>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] line-clamp-1">{title}</h3>
          <span className="text-xs text-gray-500 flex items-center whitespace-nowrap ml-2">
            <Clock size={10} className="mr-1" /> 10 min:24
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{description}</p>
        <div className="mt-2 sm:mt-3 flex justify-between items-center">
          <span className="text-xs font-medium text-[#2A5446] flex items-center">
            <Heart size={10} className="mr-1" /> {likes}
          </span>
          <span className="text-xs font-medium text-[#2A5446] flex items-center">
            <Eye size={10} className="mr-1" /> {views} Views
          </span>
        </div>
      </div>
    </div>
  );
};

// Video Selection Item component
const VideoSelectionItem = ({ video, isActive, onClick }) => (
  <div 
    className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 p-2 sm:p-3 flex items-center ${
      isActive 
        ? 'bg-[#1D3B30] text-white' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
      isActive ? 'bg-white text-[#1D3B30]' : 'bg-[#E6F0ED] text-[#1D3B30]'
    }`}>
      <Play size={12} className="sm:w-3 md:w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`font-medium text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-[#1D3B30]'}`}>
        {video.title}
      </h4>
      <p className={`text-xs truncate mt-1 ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
        {video.description.substring(0, 30)}...
      </p>
    </div>
    {isActive && <ChevronRight size={14} className="ml-2 text-white flex-shrink-0" />}
  </div>
);



// Section Heading component
const SectionHeading = ({ title, description }) => (
  <div className="text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1D3B30] mb-2 relative inline-block">
      {title}
      <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
    </h2>
    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3">
      {description}
    </p>
  </div>
);

// Main About Us Page Component
const AboutPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  const youtubeVideos = [
    {
      id: "hk_-RwghbrI",
      title: "video 1",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/hk_-RwghbrI/sddefault.jpg",
      likes: "1.2K",
      views: "5.6K"
    },
    {
      id: "a_i11PxPuis",
      title: "video 2",
      description: ".",
      thumbnail: "https://i.ytimg.com/vi/eMRRsl0RTtk/maxresdefault.jpg",
      likes: "850",
      views: "3.2K"
    },
    {
      id: "D-4-q8SslnQ",
      title: "video 3",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/R0MVAf_173g/hq720.jpg",
      likes: "2.1K",
      views: "8.9K"
    }
  ];

  const projects = [
    {
      title: "Community Waste Management System",
      category: "Waste Management",
      description: "Implementing a comprehensive waste segregation and recycling system for residential communities.",
      image: "https://impact.economist.com/ocean/images/building-sustainable-waste-management-systems-to-combat-plastic-pollution?f=auto"
    },
    {
      title: "School Environmental Education Program",
      category: "Education",
      description: "Developing curriculum and conducting workshops on environmental awareness for school students.",
      image: "https://womenforindia.org/wp-content/uploads/2020/11/IMG-20190731-WA0032-1024x768.jpg"
    },
    {
      title: "Corporate Sustainability Consulting",
      category: "Consulting",
      description: "Helping businesses reduce their environmental footprint through sustainable practices.",
      image: "https://www.lythouse.com/wp-content/uploads/2024/07/Sustainability-Coordinator-Role-Skills-and-Benefits-for-Companies-compressed.webp"
    },
    {
      title: "Green Spaces Development",
      category: "Landscaping",
      description: "Creating sustainable green spaces in generic areas to improve air quality and biodiversity.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Utf%C3%A4rder_och_solbad_i_Kuppisparken_2011.jpg/960px-Utf%C3%A4rder_och_solbad_i_Kuppisparken_2011.jpg"
    }
  ];

  const founder = {
    name: "Dr. Seema Srivastava",
    role: "Founder & Environmental Specialist",
    bio: "With over 10 years of experience in environmental conservation, Seema founded Nisargmaitri with the vision of creating a sustainable future. Her passion for eco-friendly living and community empowerment drives the organization's mission.",
    image: "/bf498b21-6f40-41aa-b5c6-3f15c2c66fb9.jpeg", // Use relative path for public folder
  
    socialLinks: [
      { 
        platform: "LinkedIn", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
        ), 
        url: "https://linkedin.com" // Replace with actual URL
      },
      { 
        platform: "Twitter", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
          </svg>
        ), 
        url: "https://twitter.com" // Replace with actual URL
      },
      { 
        platform: "Instagram", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
          </svg>
        ), 
        url: "https://instagram.com" // Replace with actual URL
      }
    ]
  };

  const milestones = [
    {
      year: "2020",
      title: "Founding of Nisargmaitri",
      description: "Started with a small team of 3 environmental enthusiasts with a mission to promote sustainable living practices."
    },
    {
      year: "2021",
      title: "First Community Project",
      description: "Implemented our first waste management system in a residential community with 200+ households."
    },
    {
      year: "2022",
      title: "Launch of Educational Programs",
      description: "Started environmental education workshops in schools, reaching over 5,000 students in the first year."
    },
    {
      year: "2023",
      title: "YouTube Channel Launch",
      description: "Began creating educational content online to reach a wider audience and share knowledge about sustainable practices."
    },
    {
      year: "2024",
      title: "Expansion to Corporate Consulting",
      description: "Started working with businesses to implement sustainable practices and reduce environmental impact."
    },
    {
      year: "2025",
      title: "Recognition & Growth",
      description: "Received state-level recognition for environmental innovation and expanded team to 15 specialists."
    }
  ];

  const navSections = [
    { id: "mission", label: "Mission & Values" },
    { id: "vision", label: "Vision" },
    { id: "founder", label: "Founder" },
    { id: "videos", label: "Videos" },
  
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans flex flex-col">
      <Navbar />
      
      {/* Mobile Navigation */}
      <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm py-2 px-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#1D3B30] font-medium flex items-center"
          >
            {activeSection ? navSections.find(s => s.id === activeSection)?.label : 'Sections'} 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
              <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md z-20 mt-1 py-2 border-t border-gray-100">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block px-4 py-2 text-sm ${
                  activeSection === section.id
                    ? 'bg-[#E6F0ED] text-[#1D3B30]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:block sticky top-0 z-10 bg-white shadow-sm py-2 px-3 sm:px-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center overflow-x-auto hide-scrollbar">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 mx-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-[#E6F0ED] text-[#1D3B30]'
                  : 'text-gray-600 hover:text-[#1D3B30] hover:bg-gray-100'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
      
      <main className="flex-grow">
        {/* Mission & Values Section */}
        <section id="mission" className="py-6 sm:py-8 md:py-12 bg-[#E6F0ED]">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeading 
              title="Our Mission & Values" 
              description="At the heart of Nisargmaitri is a commitment to environmental stewardship and community empowerment through education and sustainable practices."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Leaf size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Sustainability</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  We're committed to promoting sustainable living practices that reduce environmental impact while improving quality of life.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Users size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Community</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  We believe in the power of community action and work closely with local groups to implement sustainable solutions.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Award size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Education</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  We prioritize environmental education to empower individuals with knowledge and skills for sustainable living.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="py-6 sm:py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeading 
              title="Our Vision" 
              description="We envision a world where sustainable living is seamlessly integrated into every community, fostering a harmonious balance with nature."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Leaf size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Global Impact</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  To inspire and enable communities worldwide to adopt sustainable practices that preserve the environment for future generations.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Users size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Inclusive Growth</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  To create inclusive solutions that empower diverse communities to participate in environmental conservation regardless of socioeconomic status.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3">
                  <Award size={16} className="text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1D3B30] mb-2">Innovation</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  To continuously develop and implement innovative eco-friendly solutions that address contemporary environmental challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

      

        {/* Founder Section */}
        <section id="founder" className="py-6 sm:py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeading 
              title="Our Founder" 
              description="Meet the visionary behind Nisargmaitri and learn about her journey toward environmental conservation."
            />
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <div className="sm:flex">
                <div className="sm:flex-shrink-0">
                  <div className="h-48 sm:h-full sm:w-48 bg-[#E6F0ED] flex items-center justify-center overflow-hidden">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-sm sm:text-base font-semibold text-[#2A5446]">{founder.role}</div>
                  <h3 className="mt-1 text-base sm:text-lg md:text-xl font-bold text-[#1D3B30]">{founder.name}</h3>
                  <p className="mt-3 text-xs sm:text-sm text-gray-700">{founder.bio}</p>
                  <div className="mt-4 flex items-center space-x-3">
                    {founder.socialLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        className="text-[#2A5446] hover:text-[#1D3B30] transition-colors duration-200"
                        aria-label={`${founder.name}'s ${link.platform}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section id="videos" className="py-6 sm:py-8 md:py-12 bg-[#F5F7F6]">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeading 
              title="Youtube Videos" 
              description="Explore our collection of informative videos on sustainable living practices and environmental conservation."
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="lg:col-span-2">
                <FeaturedVideo 
                  title={youtubeVideos[currentVideoIndex].title}
                  description={youtubeVideos[currentVideoIndex].description}
                  videoId={youtubeVideos[currentVideoIndex].id}
                  thumbnail={youtubeVideos[currentVideoIndex].thumbnail}
                  likes={youtubeVideos[currentVideoIndex].likes}
                  views={youtubeVideos[currentVideoIndex].views}
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                {youtubeVideos.map((video, index) => (
                  <VideoSelectionItem
                    key={video.id}
                    video={video}
                    isActive={index === currentVideoIndex}
                    onClick={() => setCurrentVideoIndex(index)}
                  />
                ))}
                <a 
                  href="https://www.youtube.com/@Nisarg_Maitri" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white text-[#1D3B30] rounded-lg p-3 text-sm font-medium shadow-sm border border-[#E6F0ED] transition-all hover:bg-[#E6F0ED] mt-4"
                >
                  View All Videos
                  <ChevronRight size={14} className="inline-block ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

       

       

   
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;