import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email address, password)</li>
              <li>Usage data and preferences</li>
              <li>Device and browser information</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
            <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
