import React, { useState, useEffect } from 'react';
import { Play, Award, Users, Leaf, ChevronRight, Clock, MapPin, Heart, Eye } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Milestone component
const Milestone = ({ year, title, description }) => (
  <div className="relative pl-10 pb-8 border-l-4 border-[#2A5446] last:pb-0">
    <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#1D3B30] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
      <Leaf size={18} />
    </div>
    <div className="bg-white p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <span className="inline-block bg-[#E6F0ED] text-[#1D3B30] px-3 py-1 rounded-full text-sm font-semibold mb-2">{year}</span>
      <h3 className="text-lg font-bold text-[#1D3B30] mb-2">{title}</h3>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  </div>
);

// Featured Video component
const FeaturedVideo = ({ title, description, videoId, thumbnail, likes, views }) => {
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cleanVideoId = videoId.split('?')[0];

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative aspect-video bg-gray-900">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${cleanVideoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : (
          <>
            <img 
              src={thumbnail} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-[#1D3B30] transition-all duration-500 ${hovering ? 'opacity-80' : 'opacity-90'}`}></div>
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="bg-white text-[#1D3B30] w-16 h-16 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg mb-2">
                <Play size={28} fill="#1D3B30" />
              </div>
              <h3 className="text-white text-lg font-bold mt-2 text-center px-4">{title}</h3>
              <span className="bg-white bg-opacity-90 text-[#1D3B30] px-3 py-1 rounded-md text-sm font-medium shadow-md mt-2">
                Watch Now
              </span>
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-[#1D3B30]">{title}</h3>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock size={12} className="mr-1" /> 10 min:24
          </span>
        </div>
        <p className="text-gray-700 text-sm">{description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs font-medium text-[#2A5446] flex items-center">
            <Heart size={12} className="mr-1" /> {likes}
          </span>
          <span className="text-xs font-medium text-[#2A5446] flex items-center">
            <Eye size={12} className="mr-1" /> {views} Views
          </span>
        </div>
      </div>
    </div>
  );
};

// Video Selection Item component
const VideoSelectionItem = ({ video, isActive, onClick }) => (
  <div 
    className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 p-3 flex items-center ${
      isActive 
        ? 'bg-[#1D3B30] text-white' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
      isActive ? 'bg-white text-[#1D3B30]' : 'bg-[#E6F0ED] text-[#1D3B30]'
    }`}>
      <Play size={18} />
    </div>
    <div className="flex-1">
      <h4 className={`font-medium text-sm ${isActive ? 'text-white' : 'text-[#1D3B30]'}`}>
        {video.title}
      </h4>
      <p className={`text-xs truncate mt-1 ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
        {video.description.substring(0, 60)}...
      </p>
    </div>
    {isActive && <ChevronRight size={16} className="ml-2 text-white" />}
  </div>
);

// Project component
const Project = ({ image, title, category, description }) => (
  <div className="rounded-xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
    <div className="relative aspect-video bg-gray-100 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D3B30] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      <div className="absolute top-3 left-3 bg-[#1D3B30] text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">{category}</div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-[#1D3B30] mb-1">{title}</h3>
      <p className="text-gray-700 text-sm mb-3">{description}</p>
      <a href="#" className="inline-flex items-center text-[#2A5446] text-sm font-medium transition-all duration-300 hover:translate-x-1">
        Learn more
        <ChevronRight size={14} className="ml-1" />
      </a>
    </div>
  </div>
);

// Section Heading component
const SectionHeading = ({ title, description }) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    <h2 className="text-2xl font-bold text-[#1D3B30] mb-2 relative inline-block">
      {title}
      <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
    </h2>
    <p className="text-gray-700 text-sm leading-relaxed mt-4">
      {description}
    </p>
  </div>
);

// Main About Us Page Component
const AboutPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');

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

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const youtubeVideos = [
    {
      id: "hk_-RwghbrI",
      title: "Sustainable Living Practices",
      description: "Learn effective ways to incorporate eco-friendly habits into your daily routine that can make a significant difference to our environment.",
      thumbnail: "https://i.ytimg.com/vi/hk_-RwghbrI/sddefault.jpg",
      likes: "1.2K",
      views: "5.6K"
    },
    {
      id: "a_i11PxPuis",
      title: "Urban Gardening Workshop",
      description: "A comprehensive guide to starting your own sustainable garden in limited urban spaces, perfect for apartments and small homes.",
      thumbnail: "https://i.ytimg.com/vi/eMRRsl0RTtk/maxresdefault.jpg",
      likes: "850",
      views: "3.2K"
    },
    {
      id: "D-4-q8SslnQ",
      title: "Waste Reduction Techniques",
      description: "Innovative approaches to minimize waste production in households and offices through simple but effective daily practices.",
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
    name: "Seema Srivastav",
    role: "Founder & Environmental Specialist",
    bio: "With over 10 years of experience in environmental conservation, Seema founded Nisargmaitri with the vision of creating a sustainable future. Her passion for eco-friendly living and community empowerment drives the organization's mission.",
    image: "/public/seema mam new.png",
    socialLinks: [
      { 
        platform: "LinkedIn", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
        ), 
        url: "#" 
      },
      { 
        platform: "Twitter", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
          </svg>
        ), 
        url: "#" 
      },
      { 
        platform: "Instagram", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
          </svg>
        ), 
        url: "#" 
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
    { id: "story", label: "Our Story" },
    { id: "mission", label: "Mission & Values" },
    { id: "journey", label: "Our Journey" },
    { id: "founder", label: "Founder" },
    { id: "videos", label: "Videos" },
    { id: "projects", label: "Projects" }
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans flex flex-col">
      <Navbar />
      <div className="sticky top-0 z-10 bg-white shadow-sm py-2 px-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center overflow-x-auto hide-scrollbar">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`whitespace-nowrap px-4 py-2 mx-1 text-sm font-medium rounded-md transition-colors ${
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
        {/* Our Story Section */}
        <section id="story" className="py-12">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Our Story" 
              description="Nisargmaitri was born from a deep concern for our environment and a passionate belief that sustainable living is not just necessary, but achievable."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              <div className="order-2 md:order-1">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    Founded in 2020 by Rahul Gurjar, our journey began with small community-based initiatives in Greater Noida. The name "Nisargmaitri" combines "Nisarg" (nature) and "Maitri" (friendship), reflecting our core philosophy.
                  </p>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    What started as a small team of environmental enthusiasts has grown into a recognized organization with specialists in waste management, environmental education, sustainability consulting, and community engagement.
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <div className="flex items-center text-xs">
                      <MapPin size={14} className="text-[#1D3B30] mr-1" />
                      <span>Greater Noida, India</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Clock size={14} className="text-[#1D3B30] mr-1" />
                      <span>Founded 2020</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative">
                  <img 
                    src="https://images.jdmagicbox.com/quickquotes/listicle/listicle_1689831338280_oqiei_1156x867.jpg" 
                    alt="Team at work" 
                    className="rounded-xl shadow-lg w-full object-cover transform rotate-1"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#1D3B30] text-white p-3 rounded-lg shadow-md transform -rotate-1">
                    <p className="text-xl font-bold">5+ Years</p>
                    <p className="text-green-200 text-xs">of environmental impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section id="mission" className="py-12 bg-[#E6F0ED]">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Our Mission & Values" 
              description="At the heart of Nisargmaitri is a commitment to environmental stewardship and community empowerment through education and sustainable practices."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-10 h-10 flex items-center justify-center mb-3">
                  <Leaf size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1D3B30] mb-2">Sustainability</h3>
                <p className="text-gray-700 text-sm">
                  We're committed to promoting sustainable living practices that reduce environmental impact while improving quality of life.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-10 h-10 flex items-center justify-center mb-3">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1D3B30] mb-2">Community</h3>
                <p className="text-gray-700 text-sm">
                  We believe in the power of community action and work closely with local groups to implement sustainable solutions.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-full bg-[#1D3B30] w-10 h-10 flex items-center justify-center mb-3">
                  <Award size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1D3B30] mb-2">Education</h3>
                <p className="text-gray-700 text-sm">
                  We prioritize environmental education to empower individuals with knowledge and skills for sustainable living.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section id="journey" className="py-12">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Our Journey" 
              description="From humble beginnings to impactful environmental initiatives, our journey reflects our growth and commitment to creating a sustainable future."
            />
            <div className="max-w-3xl mx-auto pt-8">
              {milestones.map((milestone, index) => (
                <Milestone 
                  key={index}
                  year={milestone.year}
                  title={milestone.title}
                  description={milestone.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="py-12 bg-[#E6F0ED]">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Our Founder" 
              description="Meet the visionary behind Nisargmaitri and learn about the passion that drives our mission."
            />
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1D3B30] mb-1">{founder.name}</h3>
                  <p className="text-[#2A5446] text-sm font-medium mb-4">{founder.role}</p>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{founder.bio}</p>
                  <div className="flex space-x-3 mt-4">
                    {founder.socialLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        className="text-[#2A5446] hover:text-[#1D3B30] transition-colors"
                        aria-label={`${founder.name}'s ${link.platform}`}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-100">
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section id="videos" className="py-12">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Educational Videos" 
              description="Explore our educational content designed to inform and inspire sustainable living practices."
            />
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-2 border-r border-gray-100">
                    <FeaturedVideo 
                      videoId={youtubeVideos[currentVideoIndex].id}
                      title={youtubeVideos[currentVideoIndex].title}
                      description={youtubeVideos[currentVideoIndex].description}
                      thumbnail={youtubeVideos[currentVideoIndex].thumbnail}
                      likes={youtubeVideos[currentVideoIndex].likes}
                      views={youtubeVideos[currentVideoIndex].views}
                    />
                  </div>
                  <div className="flex flex-col p-4">
                    <h4 className="text-[#1D3B30] font-medium text-sm mb-3">More Videos</h4>
                    <div className="flex flex-col space-y-2">
                      {youtubeVideos.map((video, index) => (
                        <VideoSelectionItem
                          key={index}
                          video={video}
                          isActive={index === currentVideoIndex}
                          onClick={() => setCurrentVideoIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 bg-[#E6F0ED]">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Our Projects" 
              description="Explore some of our key initiatives that are making a positive environmental impact in communities."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <Project 
                  key={index}
                  title={project.title}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;