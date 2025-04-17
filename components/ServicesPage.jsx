import React, { useState, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  FileCheck, 
  BarChart4, 
  GraduationCap, 
  Leaf, 
  Building, 
  Users, 
  PenTool,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  X
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Simplified Service Card Component
const ServiceCard = ({ icon, title, description, category }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col h-full border border-transparent hover:border-emerald-200">
    <div className="flex items-center mb-3">
      <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg mr-2">
        {icon}
      </div>
      <h3 className="font-medium text-emerald-800">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-3 flex-grow">{description}</p>
    <div className="mt-auto pt-2 flex items-center justify-between">
      <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">
        {category}
      </span>
      <span className="text-emerald-600 text-sm flex items-center">
        Details <ChevronRight size={14} className="ml-1" />
      </span>
    </div>
  </div>
);

// Streamlined Featured Service Component
const FeaturedService = ({ title, description, icon, features }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
    <div className="bg-emerald-700 text-white p-3 md:p-0 md:w-1/4 md:flex md:items-center md:justify-center">
      <div className="flex items-center md:flex-col md:text-center">
        <div className="bg-white text-emerald-700 p-2 rounded-full mr-3 md:mr-0 md:mb-2 md:mt-6">
          {icon}
        </div>
        <h3 className="font-semibold md:pb-6 md:px-2">{title}</h3>
      </div>
    </div>
    <div className="p-4 md:w-3/4">
      <p className="text-gray-600 mb-3 text-sm">{description}</p>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="text-emerald-600 mt-1 mr-2">
              <FileCheck size={14} />
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-800">{feature.title}</h4>
              <p className="text-xs text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center transition-colors">
        Learn more <ArrowRight size={14} className="ml-1" />
      </button>
    </div>
  </div>
);

// Simplified Project Card Component
const ProjectCard = ({ title, description, tags, image, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    onClick={onClick}
  >
    <div className="h-40 overflow-hidden relative">
      <img 
        src={image || "/api/placeholder/400/300"} 
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-emerald-800 opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
          View Details
        </span>
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-600 mb-2">{description}</p>
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 2).map((tag, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs">
            {tag}
          </span>
        ))}
        {tags.length > 2 && (
          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full text-xs">
            +{tags.length - 2} more
          </span>
        )}
      </div>
    </div>
  </div>
);

// Improved Project Modal Component
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white p-3 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-emerald-800">{project.title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={project.image || "/api/placeholder/800/400"} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-emerald-700 mb-2">Overview</h4>
            <p className="text-sm text-gray-700">{project.description}</p>
          </div>
          
          {project.details && (
            <div className="mb-4">
              <h4 className="font-medium text-emerald-700 mb-2">Details</h4>
              <p className="text-sm text-gray-700">{project.details}</p>
            </div>
          )}
          
          {project.results && (
            <div className="mb-4">
              <h4 className="font-medium text-emerald-700 mb-2">Results</h4>
              <p className="text-sm text-gray-700">{project.results}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          {project.gallery && (
            <div>
              <h4 className="font-medium text-emerald-700 mb-2">Gallery</h4>
              <div className="grid grid-cols-3 gap-2">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="h-16 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={img || "/api/placeholder/200/150"} 
                      alt={`Gallery ${idx+1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact Image Carousel Component
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  return (
    <div className="relative rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="aspect-[21/9] bg-gray-100">
        <img 
          src={images[currentIndex] || "/api/placeholder/800/450"} 
          alt="Featured project" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button 
          onClick={handlePrev}
          className="bg-white/80 hover:bg-white text-emerald-800 p-1.5 rounded-full"
          aria-label="Previous image"
        >
          <ArrowLeft size={16} />
        </button>
        <button 
          onClick={handleNext}
          className="bg-white/80 hover:bg-white text-emerald-800 p-1.5 rounded-full"
          aria-label="Next image"
        >
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <div className="flex space-x-1">
          {images.map((_, idx) => (
            <button 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Compact Filter Pill Component
const FilterPill = ({ label, active, onClick }) => (
  <button
    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
      active 
        ? 'bg-emerald-600 text-white' 
        : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Main Services Page Component
const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const servicesRef = useRef(null);
  const portfolioRef = useRef(null);
  
  // Service Categories
  const serviceCategories = [
    { id: 'all', name: 'All Services' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'education', name: 'Education' },
    { id: 'implementation', name: 'Implementation' },
    { id: 'community', name: 'Community' },
  ];

  // Project Categories  
  const projectCategories = [
    { id: 'all', name: 'All Projects' },
    { id: 'waste', name: 'Waste Management' },
    { id: 'education', name: 'Education' },
    { id: 'garden', name: 'Green Spaces' },
    { id: 'community', name: 'Community' },
  ];

  // Simple placeholder images for local use
  const featuredImages = [
    "https://images.unsplash.com/photo-1586618812060-54a6fedc132c?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614650394712-3377ac03e9cb?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  // Services Data
  const services = [
    {
      id: 1,
      title: 'Waste Management Consulting',
      description: 'Expert guidance on implementing effective waste segregation, recycling, and reduction systems.',
      icon: <BarChart4 size={18} />,
      category: 'consulting',
    },
    {
      id: 2,
      title: 'Environmental Education',
      description: 'Workshops designed to raise awareness about environmental issues and sustainable practices.',
      icon: <GraduationCap size={18} />,
      category: 'education',
    },
    {
      id: 3,
      title: 'Sustainable Living Workshops',
      description: 'Practical workshops teaching how to adopt eco-friendly habits in daily life.',
      icon: <Leaf size={18} />,
      category: 'education',
    },
    {
      id: 4,
      title: 'Corporate Sustainability',
      description: 'Strategic consulting to help businesses reduce environmental footprint.',
      icon: <Building size={18} />,
      category: 'consulting',
    },
    {
      id: 5,
      title: 'Community Engagement',
      description: 'Initiative design to involve local communities in environmental conservation efforts.',
      icon: <Users size={18} />,
      category: 'community',
    },
    {
      id: 6,
      title: 'Green Space Development',
      description: 'Design of sustainable green spaces in urban and rural areas to improve biodiversity.',
      icon: <PenTool size={18} />,
      category: 'implementation',
    },
  ];

  // Featured Services Data - simplified without external images
  const featuredServices = [
    {
      title: 'Waste Management Solutions',
      description: 'End-to-end waste management solutions helping communities reduce waste through efficient systems.',
      icon: <BarChart4 size={20} />,
      features: [
        { title: 'Waste Audit & Analysis', description: 'Assessment of current waste patterns and opportunities.' },
        { title: 'System Implementation', description: 'Custom waste management infrastructure for your needs.' },
        { title: 'Community Engagement', description: 'Educational programs to ensure high participation.' },
      ],
    },
    {
      title: 'Environmental Education',
      description: 'Specialized programs designed for schools, communities, and corporations to foster awareness.',
      icon: <GraduationCap size={20} />,
      features: [
        { title: 'Interactive Workshops', description: 'Engaging learning experiences for all ages.' },
        { title: 'Custom Learning Materials', description: 'Age-appropriate resources for your audience.' },
        { title: 'Ongoing Support', description: 'Continuous guidance and impact measurement.' },
      ],
    },
  ];

  // Projects Data - simplified with placeholder images
  const projects = [
    {
      id: 1,
      title: 'Community Garden Project',
      description: 'Transformed vacant lot into thriving community garden',
      details: 'This project involved converting an abandoned 2-acre lot into a vibrant community garden. Working with local volunteers, we designed a space that includes vegetable gardens, native plant sections, and communal gathering areas.',
      results: 'The garden now produces over 1,500 pounds of fresh produce annually and serves as an educational hub for the community.',
      image: "https://www.agrifarming.in/wp-content/uploads/2019/02/History-of-Community-Gardens..jpg",
      tags: ['Implementation', 'Community', 'Garden'],
      category: 'garden'
    },
    {
      id: 2,
      title: 'School Recycling Program',
      description: 'Implemented comprehensive recycling system at local school',
      details: 'Developed and implemented a school-wide recycling program for Jefferson Elementary, including educational materials, sorting stations, and monitoring systems.',
      results: 'Reduced school waste by 45% in the first year and engaged 100% of classrooms in recycling activities.',
      image: "https://www.ssvmws.com/blog/wp-content/uploads/2024/07/imgpsh_fullsize_anim-1.png",
      tags: ['Education', 'Waste Management'],
      category: 'waste'
    },
    {
      id: 3,
      title: 'Corporate Sustainability Plan',
      description: 'Developed strategy reducing companys carbon footprint by 30%',
      details: 'Collaborated with ABC Corporation to develop a comprehensive sustainability strategy, focusing on energy use, waste reduction, and supply chain improvements.',
      results: 'Implemented changes led to 30% carbon footprint reduction and $250,000 annual savings in operational costs.',
      image: "https://assets.entrepreneur.com/content/3x2/2000/20151023074353-Untitled-1.jpeg",
      tags: ['Consulting', 'Implementation'],
      category: 'consulting'
    },
    {
      id: 4,
      title: 'Neighborhood Clean-up Drive',
      description: 'Organized community-wide clean-up collecting 500+ kg waste',
      details: 'Coordinated a neighborhood-wide cleanup event involving 150+ volunteers from local schools, businesses, and community groups.',
      results: 'Collected over 500kg of waste, properly disposed of 300kg of recyclables, and established ongoing monthly clean-up teams.',
      image: "https://surfingindia.net/wp-content/uploads/2019/09/Mantra-Beach-Clean-up-Sep-2019.webp",
      tags: ['Community', 'Education'],
      category: 'community'
    },
  ];

  // Filter services based on category and search term
  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter projects based on category
  const filteredProjects = projects.filter((project) => {
    return activeCategory === 'all' || project.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Header Section */}
      <header className="bg-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2 text-center">Our Services & Portfolio</h1>
          <p className="text-emerald-100 text-center max-w-lg mx-auto text-sm">
            Sustainable solutions for communities and organizations
          </p>
          
          {/* Simplified Tab Selection */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex rounded-lg overflow-hidden bg-emerald-700">
              <button
                className={`px-4 py-2 text-sm font-medium relative
                  ${activeTab === 'services' ? 'bg-white text-emerald-800' : 'text-white hover:bg-emerald-600'}`}
                onClick={() => {
                  setActiveTab('services');
                  setTimeout(() => scrollToSection(servicesRef), 100);
                }}
              >
                Services
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium relative
                  ${activeTab === 'work' ? 'bg-white text-emerald-800' : 'text-white hover:bg-emerald-600'}`}
                onClick={() => {
                  setActiveTab('work');
                  setTimeout(() => scrollToSection(portfolioRef), 100);
                }}
              >
                Our Work
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Smaller Image Carousel */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <ImageCarousel images={featuredImages} />
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className={`py-8 ${activeTab === 'services' ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold mb-1 text-emerald-800">
            Our Services
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            We provide a range of environmental services to help communities and organizations achieve sustainability goals.
          </p>
          
          {/* Featured Services */}
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-4 text-emerald-700 border-b border-gray-200 pb-2">
              Featured Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredServices.map((service, index) => (
                <FeaturedService
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  features={service.features}
                />
              ))}
            </div>
          </div>
          
          {/* All Services with Search and Filters */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-emerald-700 border-b border-gray-200 pb-2">
              All Services
            </h3>
            
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-8 pr-4 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={14} />
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-2 w-full md:w-auto no-scrollbar pb-1">
                {serviceCategories.map((category) => (
                  <FilterPill
                    key={category.id}
                    label={category.name}
                    active={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Service Cards Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    category={serviceCategories.find(cat => cat.id === service.category)?.name || service.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <Search size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">No services found</p>
                <p className="text-gray-400 text-xs">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio/Projects Section */}
      <section ref={portfolioRef} className={`py-8 bg-emerald-50 ${activeTab === 'work' ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold mb-1 text-emerald-800">
            Our Portfolio
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Browse our recent projects and see the impact of our environmental work.
          </p>
          
          {/* Project Filters */}
          <div className="mb-6 flex justify-center">
            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
              {projectCategories.map((category) => (
                <FilterPill
                  key={category.id}
                  label={category.name}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Project Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                image={project.image}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ServicesPage;