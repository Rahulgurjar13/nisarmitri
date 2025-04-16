import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// Logo SVG Component for Footer
const NisargmaitriLogo = () => (
  <div className="flex items-center">
    <img src="/nisargmaitri.png" className="h-12" alt="Nisargmaitri Logo" />
    <span className="ml-3 text-xl font-bold tracking-wider">NISARGMAITRI</span>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[#1A3329] text-white py-12 font-serif">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo and Description */}
          <div className="md:w-1/2 space-y-6">
            <NisargmaitriLogo />
            <p className="text-gray-100 max-w-md leading-relaxed">
              Welcome to Nisargmaitri! We promote a deep bond with nature and sustainable 
              practices for a greener future. Join us in making a difference together!
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="bg-[#2F6844] p-2 rounded-full hover:bg-[#4D7C6F] transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-[#2F6844] p-2 rounded-full hover:bg-[#4D7C6F] transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="bg-[#2F6844] p-2 rounded-full hover:bg-[#4D7C6F] transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-[#2F6844] p-2 rounded-full hover:bg-[#4D7C6F] transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-medium mb-6 relative">
              <span className="after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#4D7C6F] pb-2">Get In Touch</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mt-1 mr-3 text-[#6AAF8D] flex-shrink-0" />
                <span>Greater Noida, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-[#6AAF8D] flex-shrink-0" />
                <a href="tel:+919999010997" className="hover:text-[#76BC94] transition-colors duration-300">+91 9999010997</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-[#6AAF8D] flex-shrink-0" />
                <a href="mailto:nisargmaitri4@gmail.com" className="hover:text-[#76BC94] transition-colors duration-300">nisargmaitri4@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Clock size={20} className="mr-3 text-[#6AAF8D] flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-[#2F6844] my-8"></div>
        
        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white text-opacity-80 text-sm">
          <div className="mb-4 md:mb-0">
            Nisarg Maitri © 2025. All Rights Reserved.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <span>Website Crafted with 💚 by <a href="#" className="text-[#6AAF8D] hover:text-[#76BC94] hover:underline">Rahul Gurjar</a></span>
            <a href="/terms-condition" className="text-[#6AAF8D] hover:text-[#76BC94] hover:underline">Terms and Conditions</a>
            <a href="/privacy" className="text-[#6AAF8D] hover:text-[#76BC94] hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;