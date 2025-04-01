import React from 'react';
import { MapPin, Phone, Mail, Clock, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// Logo SVG Component for Footer
const GreenoLogoWhite = () => (
  <div className="flex items-center">
    <img src="/public/logo.png" className="h-16" alt="Nisargmaitri Logo" />
    <span className="ml-3 text-xl font-bold tracking-wider">NISARGMAITRI</span>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[#12261F] text-white py-16 font-serif">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Tagline */}
          <div className="space-y-6">
            <GreenoLogoWhite />
            <p className="text-gray-300 max-w-xs leading-relaxed">
              Welcome to Nisargmaitri! We promote a deep bond with nature and sustainable practices for a greener future. Join us in making a difference together!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#1D3B30] p-2 rounded-full hover:bg-[#2A5446] transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-[#1D3B30] p-2 rounded-full hover:bg-[#2A5446] transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-[#1D3B30] p-2 rounded-full hover:bg-[#2A5446] transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-[#1D3B30] p-2 rounded-full hover:bg-[#2A5446] transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-medium mb-6 relative">
              <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-green-500 pb-2">Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Projects', 'Blog', 'Contact'].map((link) => (
                <li key={link} className="group">
                  <a href="#" className="flex items-center hover:text-green-400 transition-colors duration-300">
                    <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Our Services */}
          <div>
            <h3 className="text-xl font-medium mb-6 relative">
              <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-green-500 pb-2">Our Services</span>
            </h3>
            <ul className="space-y-3">
              {['Waste Management', 'Eco Consulting', 'Green Workshops', 'Sustainability Plans', 'Environmental Education'].map((service) => (
                <li key={service} className="group">
                  <a href="#" className="flex items-center hover:text-green-400 transition-colors duration-300">
                    <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-medium mb-6 relative">
              <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-green-500 pb-2">Get In Touch</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mt-1 mr-3 text-green-400 flex-shrink-0" />
                <span>Greater Noida, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-green-400 flex-shrink-0" />
                <a href="tel:+919999010997" className="hover:text-green-400 transition-colors duration-300">+91 9999010997</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-green-400 flex-shrink-0" />
                <a href="mailto:nisargmaitri4@gmail.com" className="hover:text-green-400 transition-colors duration-300">nisargmaitri4@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Clock size={20} className="mr-3 text-green-400 flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
       
        
        {/* Divider */}
        <div className="h-px bg-[#2A5446] my-12"></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div>
            Nisarg Maitri © 2025. All Rights Reserved.
          </div>
          <div className="mt-4 md:mt-0">
            Website Crafted with 💚 by <a href="#" className="text-green-400 hover:underline">Rahul Gurjar</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;