import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";
const allieLogo = "/images/allie-digital-logo.png";

const Terms = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Background image - fixed position */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${gatewayBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      
      {/* Logo - top right */}
      <div className="absolute top-6 right-6 z-10">
        <img src={allieLogo} alt="Allie Digital" className="h-[130px]" />
      </div>
      
      {/* Content */}
      <div className="max-w-3xl w-full relative z-10 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: '#000000' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>Terms of Service</h1>
        
        <div className="prose prose-sm max-w-none space-y-6" style={{ color: '#000000' }}>
          <p className="text-sm" style={{ color: '#000000' }}>Last updated: March 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using Allie.ai ("the Service"), operated by Allie Digital CIC (Company No. NI718014), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>2. Description of Service</h2>
            <p>The Service is an open source educational technology platform designed to enhance learning through interactive study tools, AI-powered features, and document management capabilities. The Service is intended for educational purposes and is licensed under the GNU Affero General Public License v3 (AGPL v3).</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>3. User Accounts and Registration</h2>
            <p>To access the Service, you must create an account and complete the payment process. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain the security of your password and account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>4. Free Trial and Payment</h2>
            
            <h3 className="text-lg font-semibold mt-4" style={{ color: '#000000' }}>Free Trial</h3>
            <p>New users receive 7 days of full access to the Service at no cost. No payment details are required to start your free trial. At the end of the trial period you will be invited to purchase lifetime access to continue using the Service.</p>
            
            <h3 className="text-lg font-semibold mt-4" style={{ color: '#000000' }}>Lifetime Access</h3>
            <p>The Service operates on a one time payment of £30 for lifetime access. By completing payment:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You receive unlimited access to the Service for as long as it remains operational</li>
              <li>Payment is processed securely through Stripe</li>
              <li>"Lifetime" refers to the operational lifetime of the Service, not the user's lifetime</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4" style={{ color: '#000000' }}>Refund Policy</h3>
            <p>As the Service offers a full 7 day free trial prior to purchase, refunds will not be issued once payment has been made. This is because you will have had the opportunity to fully evaluate the Service before committing to purchase. If you experience a technical issue preventing access entirely, please contact us at <a href="mailto:alliedigital@pm.me" className="underline">alliedigital@pm.me</a> and we will work to resolve it promptly.</p>
            
            <h3 className="text-lg font-semibold mt-4" style={{ color: '#000000' }}>Trial to Paid Transition</h3>
            <p>At the end of your free trial, access to the Service will be paused until payment is completed. Your data and content will be retained for 30 days following trial expiry, giving you time to decide whether to purchase.</p>
            
            <h3 className="text-lg font-semibold mt-4" style={{ color: '#000000' }}>Accessibility Commitment</h3>
            <p>As a Community Interest Corporation, we are committed to ensuring cost is not a barrier to access. If you are a student or learner who cannot afford the one time payment, your educational provider (school, college, university, or training organisation) can purchase access on your behalf. Educational providers interested in bulk or institutional access should contact us directly.</p>
            <p>This approach allows us to maintain the infrastructure and AI services that power the platform, whilst ensuring equitable access for all learners regardless of socioeconomic background.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>5. Acceptable Use</h2>
            <p>You agree to use the Service only for lawful educational purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload content that infringes intellectual property rights</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to disrupt the hosted Service infrastructure or interfere with other users' access</li>
              <li>Upload malicious content, viruses, or harmful code to the hosted Service</li>
              <li>Use the AI features to generate inappropriate or harmful content</li>
            </ul>
            <p className="text-sm mt-2">Note: This section applies to your use of the hosted Service. Your rights to study, modify, and redistribute the source code under the AGPL v3 licence are not restricted by these terms. See our <Link to="/open-source-license" className="underline" style={{ color: '#000000' }}>Open Source License</Link> page for details.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>6. User Content</h2>
            <p>You retain ownership of any documents, notes, or materials you upload to the Service. By uploading content, you grant us a limited licence to store and process your content solely for the purpose of providing the Service. We do not claim ownership of your educational materials.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>7. AI Features and Limitations</h2>
            <p>The Service includes AI-powered features for educational assistance. Please note:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-generated content is for educational support and should be verified</li>
              <li>The AI may occasionally produce inaccurate information</li>
              <li>AI features are not a substitute for professional academic guidance</li>
              <li>Usage of AI features may be subject to fair use limits</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>8. Intellectual Property and Open Source</h2>
            <p>The source code of Allie.ai is licensed under the GNU Affero General Public License v3 (AGPL v3). Under this licence, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use, study, and modify the source code</li>
              <li>Distribute copies of the original or modified code</li>
              <li>Commercialise the software, provided any modifications or derivative works are also made available under the AGPL v3</li>
            </ul>
            <p>The Allie Digital name, logo, and branding are trademarks of Allie Digital CIC and are not covered by the AGPL v3 licence. You may not use these trademarks to imply endorsement or affiliation without written permission.</p>
            <p>User-generated content (documents, notes, and study materials you create) remains your property and is not subject to the AGPL v3 licence.</p>
            <p>For the full licence text, visit our <Link to="/open-source-license" className="underline" style={{ color: '#000000' }}>Open Source License</Link> page or the <a href="https://github.com/drsquidgeums/allie-digital-mvp" className="underline" style={{ color: '#000000' }} target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>9. Service Availability</h2>
            <p>We strive to maintain the Service's availability but cannot guarantee uninterrupted access. We may:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Perform maintenance that temporarily affects availability</li>
              <li>Modify or update features to improve the Service</li>
              <li>Suspend access for users who violate these Terms</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. This includes but is not limited to loss of data, academic outcomes, or interruption of study.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>11. Termination</h2>
            <p>We may suspend or terminate your access to the Service if you breach these Terms. Upon termination, you may request a copy of your uploaded content within 30 days.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the updated Terms.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>13. Governing Law</h2>
            <p>These Terms are governed by the laws of Northern Ireland. Any disputes shall be subject to the exclusive jurisdiction of the courts of Northern Ireland.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>14. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:alliedigital@pm.me" className="underline">alliedigital@pm.me</a>.</p>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer 
        className="text-center z-10 flex-shrink-0 mt-12"
        style={{ color: '#000000' }}
      >
        <div className="mb-3">
          <img src="/images/open-source-logo.png" alt="Open Source" className="h-[75px] mx-auto" />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© 2026 Allie Digital CIC · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
    </div>
  );
};

export default Terms;