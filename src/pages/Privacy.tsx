import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";
const allieLogo = "/images/allie-digital-logo.png";

const Privacy = () => {
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
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>Privacy Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6" style={{ color: '#000000' }}>
          <p className="text-sm" style={{ color: '#000000' }}>Last updated: January 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>1. Introduction</h2>
            <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our educational technology platform ("the Service"). We are committed to safeguarding your privacy and handling your data responsibly.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <h3 className="text-lg font-medium mt-4" style={{ color: '#000000' }}>Account Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (required for account creation)</li>
              <li>Password (stored securely using industry-standard encryption)</li>
              <li>Payment information (processed securely by Stripe; we do not store card details)</li>
            </ul>
            <h3 className="text-lg font-medium mt-4" style={{ color: '#000000' }}>Educational Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Documents you upload for study purposes</li>
              <li>Notes, highlights, and annotations you create</li>
              <li>Study materials generated through the Service</li>
            </ul>
            <h3 className="text-lg font-medium mt-4" style={{ color: '#000000' }}>Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Features you use and how you interact with the Service</li>
              <li>Session information and login times</li>
              <li>Device and browser information</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the educational Service</li>
              <li>Process your payment and manage your account</li>
              <li>Enable AI-powered study features and content generation</li>
              <li>Improve the Service based on usage patterns</li>
              <li>Send important service-related communications</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>4. AI Processing of Your Content</h2>
            <p>When you use AI-powered features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your documents and text may be processed by AI systems to generate study materials</li>
              <li>We use industry-leading AI providers with appropriate data protection agreements</li>
              <li>Your content is not used to train AI models</li>
              <li>AI-processed content is associated with your account and protected accordingly</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>5. Data Storage and Security</h2>
            <p>We take your data security seriously:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data is stored securely using Supabase, a trusted cloud infrastructure provider</li>
              <li>All data transmission is encrypted using TLS/SSL</li>
              <li>Passwords are hashed and never stored in plain text</li>
              <li>We implement row-level security to ensure users can only access their own data</li>
              <li>Regular security audits and updates are performed</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>6. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Supabase:</strong> For data storage and authentication</li>
              <li><strong>AI Providers:</strong> For processing content through AI features</li>
              <li><strong>Legal Authorities:</strong> If required by law or to protect our rights</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>7. Cookies and Tracking</h2>
            <p>We use essential cookies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences</li>
              <li>Ensure the Service functions correctly</li>
            </ul>
            <p>We do not use advertising or third-party tracking cookies.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>8. Your Rights</h2>
            <p>Under data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Data Portability:</strong> Export your data in a standard format</li>
              <li><strong>Object:</strong> Object to certain processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Where processing is based on consent</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:alliedigital@pm.me" className="underline">alliedigital@pm.me</a>.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>9. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal data is deleted within 30 days</li>
              <li>Anonymised usage data may be retained for analytics</li>
              <li>Data required for legal compliance may be retained as necessary</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>10. Children's Privacy</h2>
            <p>The Service is intended for users aged 16 and over. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, please contact us immediately.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>11. International Data Transfers</h2>
            <p>Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place, including standard contractual clauses where required.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the Service. The "Last updated" date at the top indicates when changes were made.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>13. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at <a href="mailto:alliedigital@pm.me" className="underline">alliedigital@pm.me</a>.</p>
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
        <span className="text-sm">Allie Digital CIC © All Rights Reserved 2026</span>
      </footer>
    </div>
  );
};

export default Privacy;
