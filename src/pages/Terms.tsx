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
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Use of Service</h2>
            <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You agree not to use the service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any harmful, threatening, or objectionable material</li>
              <li>To impersonate or attempt to impersonate the company or another user</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use of the service</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Termination</h2>
            <p>We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms on this page.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
