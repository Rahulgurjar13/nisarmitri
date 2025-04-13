import React from 'react';
import { MapPin, Mail } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-gray-800 font-serif">
      {/* Header */}
      <header className="bg-[#12261F] text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            Welcome to Nisarg Maitri (https://nisargmaitri.in/). By accessing or using our website, services, or products, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use our website. This website is managed by Seema Srivasatava.
          </p>

          {/* Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you disagree with any part of the terms, you should refrain from using the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">2. Changes to Terms</h2>
              <p className="text-gray-700">
                Nisarg Maitri reserves the right to modify, update, or change these Terms and Conditions at any time. Any changes will be posted on this page with an updated revision date. It is your responsibility to review these terms periodically for any updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">3. Use of Website</h2>
              <p className="text-gray-700">
                You agree to use the website for lawful purposes only. You are prohibited from engaging in any activity that disrupts or interferes with the functionality of the website, including but not limited to: transmitting viruses, spamming, or using unauthorized access tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">4. User Accounts</h2>
              <p className="text-gray-700">
                Certain services on the website may require you to create an account. By creating an account, you agree to provide accurate and complete information and maintain the confidentiality of your account credentials. You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">5. Privacy Policy</h2>
              <p className="text-gray-700">
                Our Privacy Policy governs the collection, use, and disclosure of your information. By using the website, you consent to the practices outlined in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700">
                All content, images, designs, trademarks, and other intellectual property on this website are the property of Nisarg Maitri or its licensors. You may not reproduce, distribute, or otherwise use any content from the website without explicit permission from the owner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the fullest extent permitted by law, Nisarg Maitri shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the website. This includes, but is not limited to, any errors or omissions in the content, loss of data, or other damage to your devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">8. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites. These links are provided for your convenience. Nisarg Maitri does not control and is not responsible for the content, privacy practices, or actions of third-party sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">9. Governing Law</h2>
              <p className="text-gray-700">
                These terms are governed by the laws of India, and any disputes will be resolved under the jurisdiction of the courts located in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">10. Refund and Return</h2>
              <p className="text-gray-700">
                We are not providing any kind of return, replacement, and refund due to the nature of our business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">11. Shipping</h2>
              <p className="text-gray-700">
                All orders will be delivered within 5-7 business days.
              </p>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-12 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-[#12261F] mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-green-600 flex-shrink-0" />
                <a href="mailto:nisargmaitri4@gmail.com" className="hover:text-green-800 transition-colors duration-300">
                  nisargmaitri4@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer (Optional, for consistency) */}
      <footer className="bg-[#12261F] text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Nisarg Maitri © 2025. All Rights Reserved. Website Crafted with 💚 by <a href="#" className="text-green-400 hover:underline">Rahul Gurjar</a> | <a href="/terms" className="text-green-400 hover:underline">Terms and Conditions</a> | <a href="/privacy" className="text-green-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;