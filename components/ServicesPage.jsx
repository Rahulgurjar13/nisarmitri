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
      title: 'Workshops & Seminars on Climate Change, Plastic Pollution, Biodiversity, etc.',
      description: 'As Planet Warriors, we conduct engaging workshops and seminars on key environmental issues like climate change, plastic pollution, and biodiversity loss. These sessions raise awareness, foster eco-conscious thinking, and empower communities to take action. Using interactive tools such as visuals, activities, and real-life case studies, we tailor content for schools, colleges, housing societies, and corporates. Participants learn practical steps for sustainable living, waste reduction, and conservation.  These workshops align with global sustainability goals and nurture responsible citizens committed to protecting our planet for future generations.',
      icon: <BarChart4 size={18} />,
      
    },
    {
      id: 2,
      title: 'Eco-Education Programs in schools and colleges',
      description: 'Eco-Education Programs in schools and colleges aim to instill environmental awareness, responsibility, and sustainable practices among students. These programs integrate interactive lessons on climate change, biodiversity, waste management, and conservation into the academic setting. Through activities like green clubs, eco-quizzes, clean-up drives, and hands-on projects such as composting or tree planting, students learn the importance of protecting natural resources. We also train teachers and staff to incorporate sustainability into daily routines and curriculum. By engaging youth early, we nurture environmentally conscious citizens who can lead positive change and contribute to a greener, healthier future aligned with global sustainability goals.',
      icon: <GraduationCap size={18} />,
    
    },
    {
      id: 3,
      title: 'Waste Management & Recycling Services',
      description: 'Our Waste Management & Recycling Services focus on promoting responsible waste disposal and resource recovery within communities, institutions, and households. We conduct awareness drives, set up waste segregation systems, and organize recycling campaigns for plastics, e-waste, paper, and textiles. We also guide on setting up home and community composting for organic waste, reducing landfill burden. Through hands-on training and eco-audits, we help identify waste hotspots and offer sustainable alternatives. Our goal is to build zero-waste societies by encouraging reduce-reuse-recycle habits and linking communities with certified recyclers, contributing to cleaner environments and supporting a circular economy model. ',
      icon: <Leaf size={18} />,
  
    },
    {
      id: 4,
      title: 'Plastic-Free Lifestyle Tips',
      description: 'Adopting a plastic-free lifestyle starts with simple swaps: use cloth bags instead of plastic, carry a reusable water bottle and cutlery, and choose glass or metal containers over plastic ones. Avoid single-use items like straws and packaged foods. We provide tailored eco-product recommendations that promote sustainable living, including biodegradable alternatives to plastic, eco-friendly refills, reusable home essentials, and low-impact personal care items. These suggestions help individuals and organizations reduce their environmental footprint without compromising convenience. By choosing products made from natural, compostable, or recycled materials, users support responsible consumption, minimize waste, and contribute to a greener, healthier planet through informed, conscious purchasing decisions.',
      icon: <Building size={18} />,
 
    },
    {
      id: 5,
      title: 'Zero-Waste Event Planning (eco-friendly weddings, events)',
      description: 'Zero-Waste Event Planning focuses on organizing eco-friendly weddings and events that minimize environmental impact. We help clients reduce waste through reusable décor, digital invitations, local and organic catering, compostable tableware, and waste segregation systems. Emphasis is placed on reducing single-use items and partnering with sustainable vendors. These thoughtful choices not only lower the carbon footprint but also set a meaningful example of conscious celebration and responsible event management.',
      icon: <Users size={18} />,
  
    },
    {
      id: 6,
      title: 'Urban Farming and Terrace Gardening Consultation ',
      description: 'Our Urban Gardening and Terrace Farming consultancy empowers individuals and communities to grow their own food in limited spaces. We offer guidance on soil preparation, container selection, seasonal planting, composting, and organic pest control. Whether its a kitchen garden or a full-scale terrace farm, we help design sustainable setups that promote food security, reduce carbon footprint, and reconnect people with nature, turning unused urban spaces into green, productive oases.',
      icon: <PenTool size={18} />,
    
    },
    {
      id: 7,
      title: 'Our Sustainable Menstruation Awareness services',
      description: 'Our Sustainable Menstruation Awareness services educate individuals, especially young women and girls, on eco-friendly menstrual choices. We promote the use of reusable products like menstrual cups, cloth pads, and period panty to reduce plastic waste and health risks. Through workshops, demonstrations, and community outreach, we break taboos, encourage hygienic practices, and empower menstruators to make informed, sustainable decisions that benefit both personal health and the environment.',
      icon: <PenTool size={18} />,
    
    },
  ];

  // Featured Services Data - simplified without external images
  const featuredServices = [
    {
      title: 'Empowering Education: Gifting School Essentials',
      description: 'We support schools by gifting essential school supplies and stationery etc. This initiative helps reduce the burden on families, encourages regular attendance, and creates a more inclusive and positive learning environment. By empowering students with the tools they need, we contribute to a stronger, more equitable education system.',
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
      title: 'Empowering Education: Gifting School Essentials',
    
      details: 'We support schools by gifting essential school supplies and stationery etc. This initiative helps reduce the burden on families, encourages regular attendance, and creates a more inclusive and positive learning environment. By empowering students with the tools they need, we contribute to a stronger, more equitable education system.',
   
      image: "/WhatsApp Image 2025-07-26 at 5.54.59 PM.jpeg",
      tags: [],
    
    },
    {
      id: 2,
      title: 'Water Pots for Street Animals',
      description: 'Implemented comprehensive recycling system at local school',
      details: 'We have initiated the Water Pots for Street Animals campaign in Greater Noida to provide clean drinking water for stray animals during extreme heat. Since many areas lack natural water sources, we install and regularly refill done by volunteers of Save Animal, Greater Noida. This compassionate step helps reduce animal suffering and promotes a more humane, responsible society.',
    
      image: "/WhatsApp Image 2025-07-26 at 5.54.18 PM.jpeg",
      tags: [],
     
    },
    {
      id: 3,
      title: 'Feeding Street Animals',
      
      details: 'We actively feed street animals, ensuring they receive regular, nutritious meals. This initiative supports the well-being of stray animals reduces hunger-related aggression, and fosters compassion within communities.',
      image: "/WhatsApp Image 2025-07-26 at 5.55.08 PM.jpeg",
      tags: []
     
    },
    {
      id: 4,
      title: 'Treatment to Street Animals',
     
      details: 'We provide vaccinations to street animals to protect them from deadly diseases like rabies, distemper, and parvovirus, contributing to both animal and public health. Additionally, we rescue and transport sick or injured animals to veterinary hospitals for timely treatment. These efforts ensure safer, healthier lives for strays and promote compassion and coexistence in urban communities.',
     
      image: "/WhatsApp Image 2025-07-26 at 5.55.05 PM.jpeg",
      tags: [],
    
    },
    {
      id: 5,
      title: 'Reducing Textile Waste',
     
      details: 'We upcycle boutique waste into useful products like bags, accessories, and home décor items, creatively reducing textile waste. By repurposing fabric scraps, we promote sustainable fashion,  and prevent tons of cloth from ending up in landfills, encouraging a circular economy and mindful consumption.',
     
      image: "/WhatsApp Image 2025-07-26 at 5.55.01 PM.jpeg",
      tags: [],
    
    },
    {
      id: 6,
      title: 'Bioenzyme and Seed Ball Making Workshops',
     
      details: 'We conducted Bioenzyme and Seed Ball Making Workshops in college to promote sustainable practices among students. Participants learned to create natural cleaners from kitchen waste and seed balls for reforestation efforts. These hands-on sessions encouraged waste-to-resource thinking, environmental responsibility, and active participation in greening urban spaces and restoring biodiversity.',
     
      image: "/WhatsApp Image 2025-07-26 at 5.54.39 PM.jpeg",
      tags: [],
    
    },
    {
      id: 7,
      title: 'Supporting and Uplifting Lives in Old Age Homes',
     
      details: 'We support old age homes by providing essential supplies, organizing eatables, and spending quality time with residents through interactive activities and celebrations. Our efforts aim to bring comfort, companionship, and dignity to the elderly, ensuring they feel valued, cared for, and connected to a compassionate community.',
     
      image: "/WhatsApp Image 2025-07-26 at 5.55.03 PM.jpeg",
      tags: [],
    
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
            Our Works
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            We provide a range of environmental services to help communities and organizations achieve sustainability goals.
          </p>
          
          {/* Featured Services */}
          <div className="mb-8">
           
        
          </div>
          
          {/* All Services with Search and Filters */}
          <div>
          
            
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-64">
             
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-2 w-full md:w-auto no-scrollbar pb-1">
             
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