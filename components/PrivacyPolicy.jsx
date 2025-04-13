import React from 'react';
import { Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-gray-800 font-serif">
      {/* Header */}
      <header className="bg-[#12261F] text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            At Nisarg Maitri (https://nisargmaitri.in/), we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or use our services. By accessing or using our website, you consent to the practices described in this policy.
          </p>

          {/* Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">1. Information We Collect</h2>
              <p className="text-gray-700">
                We may collect the following types of personal information when you visit our website:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Personal Identification Information: This includes your name, email address, phone number, etc., which you may provide when contacting us, signing up for newsletters, or making a purchase.</li>
                <li>Usage Data: We may collect data about how you interact with the website, including your IP address, browser type, device information, and pages visited. This information is collected through cookies and tracking technologies.</li>
                <li>Cookies and Tracking Technologies: We use cookies to improve the functionality of our website, personalize your experience, and analyze usage. You can control cookies through your browser settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700">
                The information we collect may be used for the following purposes:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>To respond to your inquiries or customer service requests.</li>
                <li>To send you updates, newsletters, or promotional materials (if you have subscribed).</li>
                <li>To process transactions and manage payments (if applicable).</li>
                <li>To improve our website's functionality and optimize user experience.</li>
                <li>To comply with legal obligations or resolve disputes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">3. How We Protect Your Information</h2>
              <p className="text-gray-700">
                We implement appropriate physical, technical, and administrative measures to safeguard your personal information from unauthorized access, alteration, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">4. Sharing Your Information</h2>
              <p className="text-gray-700">
                We do not sell, rent, or share your personal information with third parties except in the following cases:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Service Providers: We may share your data with trusted third-party service providers who assist us in operating our website or providing services to you, such as hosting, payment processing, and customer support. These third parties are obligated to maintain the confidentiality of your information.</li>
                <li>Legal Requirements: We may disclose your information if required by law or in response to a valid legal request, such as a subpoena or court order.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">5. Your Rights</h2>
              <p className="text-gray-700">
                Depending on your location and applicable laws, you may have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Access: You can request a copy of the personal information we hold about you.</li>
                <li>Correction: You can request the correction of inaccurate or incomplete personal information.</li>
                <li>Deletion: You can request the deletion of your personal data, subject to legal or contractual restrictions.</li>
                <li>Opt-Out: You can opt out of receiving marketing communications from us by following the unsubscribe instructions in the emails or contacting us directly.</li>
              </ul>
              <p className="mt-2 text-gray-700">
                To exercise any of these rights, please contact us at <a href="mailto:nisargmaitri4@gmail.com" className="text-green-600 hover:underline">nisargmaitri4@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">6. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to external websites. We are not responsible for the content or privacy practices of those third-party sites. We encourage you to read the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700">
                Our website is not intended for individuals under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal information from a child, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700">
                If you are accessing our website from outside of India, please note that your information may be transferred to, processed, and stored in India. By using our services, you consent to the transfer and processing of your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#12261F] mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Please review this policy periodically to stay informed about how we are protecting your information.
              </p>
            </section>
          </div>

          {/* Contact Information */}
          <div className="mt-12 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-[#12261F] mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:
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

export default PrivacyPolicy;