import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using this educational technology platform ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>The Service is an educational technology platform designed to enhance learning through interactive study tools, AI-powered features, and document management capabilities. The Service is intended for educational purposes only.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts and Registration</h2>
            <p>To access the Service, you must create an account and complete the payment process. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain the security of your password and account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Payment and Lifetime Access</h2>
            <p>The Service operates on a one-time payment model for lifetime access. By completing payment:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You receive unlimited access to the Service for as long as it remains operational</li>
              <li>Payment is processed securely through Stripe</li>
              <li>Refunds may be requested within 14 days of purchase if you have not substantially used the Service</li>
              <li>"Lifetime" refers to the operational lifetime of the Service, not the user's lifetime</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Acceptable Use</h2>
            <p>You agree to use the Service only for lawful educational purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload content that infringes intellectual property rights</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the Service</li>
              <li>Use the Service for any commercial purposes without permission</li>
              <li>Upload malicious content, viruses, or harmful code</li>
              <li>Use the AI features to generate inappropriate or harmful content</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. User Content</h2>
            <p>You retain ownership of any documents, notes, or materials you upload to the Service. By uploading content, you grant us a limited licence to store and process your content solely for the purpose of providing the Service. We do not claim ownership of your educational materials.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. AI Features and Limitations</h2>
            <p>The Service includes AI-powered features for educational assistance. Please note:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-generated content is for educational support and should be verified</li>
              <li>The AI may occasionally produce inaccurate information</li>
              <li>AI features are not a substitute for professional academic guidance</li>
              <li>Usage of AI features may be subject to fair use limits</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Intellectual Property</h2>
            <p>The Service, including its design, features, and functionality, is owned by us and protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without permission.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Service Availability</h2>
            <p>We strive to maintain the Service's availability but cannot guarantee uninterrupted access. We may:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Perform maintenance that temporarily affects availability</li>
              <li>Modify or update features to improve the Service</li>
              <li>Suspend access for users who violate these Terms</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. This includes but is not limited to loss of data, academic outcomes, or interruption of study.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Termination</h2>
            <p>We may suspend or terminate your access to the Service if you breach these Terms. Upon termination, you may request a copy of your uploaded content within 30 days.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the updated Terms.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">13. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">14. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us through the support features within the application.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
