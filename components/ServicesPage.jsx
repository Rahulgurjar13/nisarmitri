import React, { useState, useEffect, useRef } from 'react';
import { Users, Leaf, ChevronRight, Zap, FileCheck, BarChart4, PenTool, GraduationCap, Building, ArrowRight, Search, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Service Card Component with improved mobile design
const ServiceCard = ({ icon, title, description, features }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl shadow-md overflow-hidden transition-all duration-500 bg-white h-full transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 sm:p-5 flex flex-col h-full">
        <div
          className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3
                      ${isHovered ? 'bg-[#1D3B30] text-white' : 'bg-[#E6F0ED] text-[#1D3B30]'}
                      transition-all duration-300`}
        >
          {icon}
        </div>

        <h3 className="text-base font-bold text-[#1D3B30] mb-2">{title}</h3>

        <p className="text-sm text-gray-700 mb-3 flex-grow">{description}</p>

        {features && (
          <ul className="space-y-1 mb-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="text-[#2A5446] mr-2 mt-0.5">
                  <FileCheck size={12} />
                </div>
                <span className="text-xs text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <button
            className={`flex items-center text-sm font-medium
                      ${isHovered ? 'text-[#1D3B30]' : 'text-[#2A5446]'} 
                      transition-colors duration-300`}
            aria-label={`Learn more about ${title}`}
          >
            Learn more
            <ArrowRight size={14} className={`ml-1 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Featured Service Component with better mobile responsiveness
const FeaturedService = ({ title, image, description, features, reverse = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const serviceRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = serviceRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={serviceRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-5 items-center
                 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
    >
      <div className={`${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        <span className="inline-block bg-[#E6F0ED] text-[#1D3B30] px-2 py-1 rounded-full text-xs font-semibold mb-2">
          Featured Service
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-[#1D3B30] mb-3">{title}</h3>
        <p className="text-sm text-gray-700 mb-4">{description}</p>

        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm">
              <div className="text-[#2A5446] mr-2">
                <FileCheck size={16} />
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#1D3B30]">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="inline-flex items-center justify-center px-4 py-2 bg-[#1D3B30] text-white text-sm rounded-md font-medium hover:bg-[#2A5446] transition-colors"
          aria-label={`Learn more about ${title}`}
        >
          Learn more
          <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className={`${reverse ? 'lg:order-1' : 'lg:order-2'} mt-4 lg:mt-0`}>
        <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-[#E6F0ED]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x250?text=Service+Image';
              // Alternative: Use a local asset
              // e.target.src = '/images/fallback-service.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D3B30] to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

// Portfolio/Work Showcase Component
const ProjectShowcase = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <div key={index} className="group relative rounded-lg overflow-hidden shadow-md bg-white">
          <div className="aspect-video bg-gray-200 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://placehold.co/350x200?text=Project+Image';
                // Alternative: Use a local asset
                // e.target.src = '/images/fallback-project.jpg';
              }}
            />
          </div>
          <div className="p-3">
            <h4 className="font-medium text-sm text-[#1D3B30] mb-1">{project.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-[#E6F0ED] text-[#1D3B30] rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Services Page Component
const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  const serviceCategories = [
    { id: 'all', name: 'All' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'education', name: 'Education' },
    { id: 'implementation', name: 'Implementation' },
    { id: 'community', name: 'Community' },
  ];

  const services = [
    {
      id: 1,
      title: 'Waste Management Consulting',
      description: 'Professional guidance on implementing effective waste segregation, recycling, and reduction systems.',
      icon: <BarChart4 size={20} />,
      category: 'consulting',
      features: ['Waste audit', 'Custom plans', 'Implementation guidance', 'Monitoring'],
    },
    {
      id: 2,
      title: 'Environmental Education Programs',
      description: 'Educational workshops designed to raise awareness about environmental issues and sustainable practices.',
      icon: <GraduationCap size={20} />,
      category: 'education',
      features: ['School workshops', 'Community programs', 'Corporate training', 'Educational resources'],
    },
    {
      id: 3,
      title: 'Sustainable Living Workshops',
      description: 'Practical workshops teaching how to adopt eco-friendly habits in daily life.',
      icon: <Leaf size={20} />,
      category: 'education',
      features: ['Home composting', 'Energy conservation', 'Water saving methods', 'Sustainable cooking'],
    },
    {
      id: 4,
      title: 'Corporate Sustainability Planning',
      description: 'Strategic consulting to help businesses reduce environmental footprint and implement sustainable practices.',
      icon: <Building size={20} />,
      category: 'consulting',
      features: ['Impact assessment', 'Strategy development', 'ESG reporting', 'Green certification'],
    },
    {
      id: 5,
      title: 'Community Engagement Programs',
      description: 'Initiative design to involve local communities in environmental conservation efforts.',
      icon: <Users size={20} />,
      category: 'community',
      features: ['Clean-up drives', 'Neighborhood gardens', 'Awareness campaigns', 'Conservation initiatives'],
    },
    {
      id: 6,
      title: 'Green Space Development',
      description: 'Design of sustainable green spaces in urban and rural areas to improve biodiversity.',
      icon: <PenTool size={20} />,
      category: 'implementation',
      features: ['Urban garden design', 'Native landscaping', 'Biodiversity zones', 'Community gardens'],
    },
  ];

  const featuredServices = [
    {
      title: 'Waste Management Solutions',
      image: 'https://placehold.co/400x250?text=Waste+Management',
      description: 'End-to-end waste management solutions helping communities reduce waste through efficient segregation and recycling systems.',
      features: [
        { title: 'Waste Audit & Analysis', description: 'Assessment of current waste patterns and improvement opportunities.' },
        { title: 'System Implementation', description: 'Custom waste management infrastructure for your specific needs.' },
        { title: 'Community Engagement', description: 'Educational programs to ensure high participation and proper system use.' },
      ],
    },
    {
      title: 'Environmental Education Programs',
      image: 'https://placehold.co/400x250?text=Education+Programs',
      description: 'Specialized educational programs designed for schools, communities, and corporations to foster environmental awareness.',
      features: [
        { title: 'Interactive Workshops', description: 'Engaging learning experiences accessible to all ages.' },
        { title: 'Custom Learning Materials', description: 'Age-appropriate resources developed for your audience.' },
        { title: 'Ongoing Support', description: 'Continuous guidance and impact measurement for effectiveness.' },
      ],
      reverse: true,
    },
  ];

  const projects = [
    {
      title: 'Community Garden Project',
      description: 'Transformed vacant lot into thriving community garden',
      image: 'https://placehold.co/350x200?text=Garden+Project',
      tags: ['Implementation', 'Community'],
    },
    {
      title: 'School Recycling Program',
      description: 'Implemented comprehensive recycling system at local school',
      image: 'https://placehold.co/350x200?text=School+Recycling',
      tags: ['Education', 'Waste Management'],
    },
    {
      title: 'Corporate Sustainability Plan',
      description: 'Developed strategy reducing company’s carbon footprint by 30%',
      image: 'https://placehold.co/350x200?text=Corporate+Plan',
      tags: ['Consulting', 'Implementation'],
    },
    {
      title: 'Neighborhood Clean-up Drive',
      description: 'Organized community-wide clean-up collecting 500+ kg waste',
      image: 'https://placehold.co/350x200?text=Clean+Up+Drive',
      tags: ['Community', 'Education'],
    },
    {
      title: 'Sustainable Housing Consultation',
      description: 'Redesigned residential complex for energy efficiency',
      image: 'https://placehold.co/350x200?text=Sustainable+Housing',
      tags: ['Consulting', 'Implementation'],
    },
    {
      title: 'Environmental Education Workshop',
      description: 'Trained 200+ teachers on environmental curriculum integration',
      image: 'https://placehold.co/350x200?text=Education+Workshop',
      tags: ['Education', 'Community'],
    },
  ];

  // Filter services based on category and search term
  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      {/* Hero Banner with Tabs */}
      <section className="bg-[#1D3B30] py-6 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Our Services & Work</h1>
            <p className="text-sm text-gray-200 max-w-lg mx-auto">
              Discover how we’re creating sustainable solutions for communities and organizations through our services and completed projects.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex bg-[#2A5446] rounded-lg p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'services' ? 'bg-white text-[#1D3B30]' : 'text-white'
                }`}
                onClick={() => setActiveTab('services')}
                aria-current={activeTab === 'services' ? 'page' : undefined}
              >
                Services
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'work' ? 'bg-white text-[#1D3B30]' : 'text-white'
                }`}
                onClick={() => setActiveTab('work')}
                aria-current={activeTab === 'work' ? 'page' : undefined}
              >
                Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeTab === 'services' ? (
        <>
          {/* Our Approach Section */}
          <section className="py-6 sm:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto mb-6 text-center">
                <h2 className="text-lg sm:text-xl font-bold text-[#1D3B30] mb-2 relative inline-block">
                  Our Approach
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
                </h2>
                <p className="text-sm text-gray-700">
                  A holistic, community-centered approach combining education, expert consultation, and practical implementation.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow-sm p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0ED] flex items-center justify-center mb-2">
                    <Search size={18} className="text-[#1D3B30]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1D3B30] mb-1">Assessment</h3>
                  <p className="text-xs text-gray-700">Thorough assessment of current practices, identifying improvement areas.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0ED] flex items-center justify-center mb-2">
                    <PenTool size={18} className="text-[#1D3B30]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1D3B30] mb-1">Planning</h3>
                  <p className="text-xs text-gray-700">Customized action plans with clear objectives and timelines.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0ED] flex items-center justify-center mb-2">
                    <Zap size={18} className="text-[#1D3B30]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1D3B30] mb-1">Implementation</h3>
                  <p className="text-xs text-gray-700">Hands-on implementation with proper training and community engagement.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0ED] flex items-center justify-center mb-2">
                    <TrendingUp size={18} className="text-[#1D3B30]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1D3B30] mb-1">Monitoring</h3>
                  <p className="text-xs text-gray-700">Ongoing evaluation to track progress and measure impact.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Services Section */}
          <section className="py-6 sm:py-8 bg-[#E6F0ED]">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto mb-6 text-center">
                <h2 className="text-lg sm:text-xl font-bold text-[#1D3B30] mb-2 relative inline-block">
                  Featured Services
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
                </h2>
                <p className="text-sm text-gray-700">Our most impactful environmental services for sustainable communities.</p>
              </div>

              <div className="space-y-8">
                {featuredServices.map((service, index) => (
                  <FeaturedService
                    key={index}
                    title={service.title}
                    image={service.image}
                    description={service.description}
                    features={service.features}
                    reverse={service.reverse}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* All Services Section */}
          <section className="py-6 sm:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto mb-6 text-center">
                <h2 className="text-lg sm:text-xl font-bold text-[#1D3B30] mb-2 relative inline-block">
                  All Services
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
                </h2>
                <p className="text-sm text-gray-700 mb-4">Browse our full range of services for various environmental needs.</p>

                {/* Search and Filter - Mobile Friendly */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="relative mx-auto w-full max-w-xs">
                    <label htmlFor="service-search" className="sr-only">
                      Search services
                    </label>
                    <input
                      id="service-search"
                      type="text"
                      placeholder="Search services..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1D3B30]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={14} />
                    </div>
                  </div>

                  <div className="flex overflow-x-auto gap-2 justify-center pb-1 scrollbar-hidden">
                    {serviceCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors
                                ${activeCategory === category.id ? 'bg-[#1D3B30] text-white' : 'bg-white text-[#1D3B30] hover:bg-gray-100'}`}
                        onClick={() => setActiveCategory(category.id)}
                        aria-pressed={activeCategory === category.id}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Cards Grid - Mobile Optimized */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      icon={service.icon}
                      title={service.title}
                      description={service.description}
                      features={service.features}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-[#1D3B30] mb-3">
                    <Search size={32} className="mx-auto opacity-50" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700 mb-1">No services found</h3>
                  <p className="text-sm text-gray-600">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        // Our Work Portfolio Section
        <section className="py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto mb-6 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D3B30] mb-2 relative inline-block">
                Our Projects
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#2A5446] rounded-full"></span>
              </h2>
              <p className="text-sm text-gray-700 mb-4">Explore some of our recent environmental projects and their impact.</p>
            </div>

            <ProjectShowcase projects={projects} />

            <div className="mt-8 text-center">
              <button
                className="inline-flex items-center justify-center px-4 py-2 bg-[#1D3B30] text-white text-sm rounded-md font-medium hover:bg-[#2A5446] transition-colors"
                aria-label="View all projects"
              >
                View all projects
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ServicesPage;