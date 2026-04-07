import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SupportDialog } from "@/components/support/SupportDialog";
import { Link } from "react-router-dom";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";
const allieLogo = "/images/allie-digital-logo.png";

const Privacy = () => {
  const [supportOpen, setSupportOpen] = useState(false);
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
          <p className="text-sm" style={{ color: '#000000' }}>Last updated: March 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>1. Data Controller</h2>
            <p>The data controller responsible for your personal data is:</p>
            <p><strong>Allie Digital CIC</strong><br />
            Company Number: NI718014<br />
            Email: contact us via our <button onClick={() => setSupportOpen(true)} className="underline font-medium cursor-pointer bg-transparent border-none p-0 inline" style={{ color: 'inherit' }}>support</button> feature</p>
            <p>For the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, Allie Digital CIC is the controller of your personal data.</p>
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
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>3. Lawful Basis for Processing</h2>
            <p>We process your personal data on the following lawful bases under Article 6 of the UK GDPR:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract (Article 6(1)(b)):</strong> Processing your account information and payment data is necessary to perform our contract with you (providing access to the Service)</li>
              <li><strong>Legitimate Interests (Article 6(1)(f)):</strong> Processing usage data to improve the Service, ensure security, and prevent fraud. We have assessed that these interests do not override your rights and freedoms</li>
              <li><strong>Legal Obligation (Article 6(1)(c)):</strong> Where we are required to retain data for tax, accounting, or regulatory purposes</li>
              <li><strong>Consent (Article 6(1)(a)):</strong> Where you explicitly opt in to optional features such as AI-powered content processing. You may withdraw consent at any time</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>4. How We Use Your Information</h2>
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
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>5. AI Processing of Your Content</h2>
            <p>When you use AI-powered features, your content is processed by the following third-party AI providers:</p>
            <ul className="list-disc pl-6 space-y-2">
               <li><strong>OpenAI</strong>: Powers the AI study assistant, text simplification, task suggestions, and content enhancement features</li>
               
               <li><strong>ElevenLabs</strong>: Provides text to speech and voice AI functionality</li>
            </ul>
            <p>When using these AI features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your documents and text are sent to these providers for processing</li>
              <li>We have appropriate data processing agreements in place with each provider</li>
              <li>Your content is not used to train AI models</li>
              <li>AI-processed content is associated with your account and protected accordingly</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>6. Data Storage and Security</h2>
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
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>7. Data Sharing</h2>
            <p>We do not sell your personal information. We share data with the following third parties who act as data processors on our behalf:</p>
            <ul className="list-disc pl-6 space-y-2">
               <li><strong>Stripe</strong> (United States): For secure payment processing</li>
               <li><strong>Supabase</strong> (United States/EU): For data storage, authentication, and backend services</li>
               <li><strong>OpenAI</strong> (United States): For AI powered study features</li>
               
               <li><strong>ElevenLabs</strong> (United States): For text to speech and voice features</li>
               <li><strong>Legal Authorities</strong>: If required by law or to protect our rights</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>8. Cookies and Tracking</h2>
            <p>We use essential cookies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences</li>
              <li>Ensure the Service functions correctly</li>
            </ul>
            <p>We do not use advertising or third-party tracking cookies.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>9. International Data Transfers</h2>
            <p>Some of our third-party processors are based in the United States. Where your data is transferred outside the United Kingdom, we ensure appropriate safeguards are in place, including the UK International Data Transfer Agreement (IDTA) or standard contractual clauses approved by the Information Commissioner's Office (ICO).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>10. Your Rights</h2>
            <p>Under the UK GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access (Article 15):</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification (Article 16):</strong> Correct inaccurate personal data</li>
              <li><strong>Right to Erasure (Article 17):</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing (Article 18):</strong> Limit how we process your data</li>
              <li><strong>Right to Data Portability (Article 20):</strong> Export your data in a standard format</li>
              <li><strong>Right to Object (Article 21):</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing</li>
            </ul>
            <p>To exercise these rights, please contact us using our <button onClick={() => setSupportOpen(true)} className="underline font-medium cursor-pointer bg-transparent border-none p-0 inline" style={{ color: 'inherit' }}>support</button> feature. We will respond within one month of your request.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>11. Complaints</h2>
            <p>If you are not satisfied with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Website: <a href="https://ico.org.uk/make-a-complaint/" className="underline" style={{ color: '#000000' }} target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a></li>
              <li>Telephone: 0303 123 1113</li>
              <li>Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
            </ul>
            <p>We would appreciate the opportunity to address your concerns before you approach the ICO, so please contact us first using our <button onClick={() => setSupportOpen(true)} className="underline font-medium cursor-pointer bg-transparent border-none p-0 inline" style={{ color: 'inherit' }}>support</button> feature.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>12. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal data is deleted within 30 days</li>
              <li>Anonymised usage data may be retained for analytics</li>
              <li>Data required for legal compliance may be retained as necessary</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>13. Children's Privacy</h2>
            <p>The Service is intended for users aged 16 and over. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, please contact us immediately.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>14. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the Service. The "Last updated" date at the top indicates when changes were made.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>15. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact:</p>
            <p><strong>Allie Digital CIC</strong><br />
            Company Number: NI718014<br />
            Email: contact us via our <button onClick={() => setSupportOpen(true)} className="underline font-medium cursor-pointer bg-transparent border-none p-0 inline" style={{ color: 'inherit' }}>support</button> feature</p>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer 
        className="text-center z-10 flex-shrink-0 mt-12"
        style={{ color: '#000000' }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© 2026 Allie Digital CIC · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </div>
  );
};

export default Privacy;