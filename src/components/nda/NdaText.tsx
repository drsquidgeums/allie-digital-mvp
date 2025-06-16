
import React from "react";

export const NdaText: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none text-sm bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
      <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">
        Effective Date: May 16, 2025
      </p>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2" id="section-1">
            1. CONFIDENTIALITY AGREEMENT
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            This Non-Disclosure Agreement ("Agreement") is entered into by and between Allie Digital Ltd 
            ("Disclosing Party") and you, the individual accessing this application ("Recipient").
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2" id="section-2">
            2. CONFIDENTIAL INFORMATION
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
            "Confidential Information" means any and all information disclosed to Recipient by the Disclosing 
            Party, either directly or indirectly, in writing, orally, or by inspection of tangible or intangible 
            objects, including but not limited to:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200" aria-label="Confidential information items">
            <li className="leading-relaxed">The application, its features, functionality, and user interface</li>
            <li className="leading-relaxed">Documents, content, and data accessible through the application</li>
            <li className="leading-relaxed">Technical specifications, algorithms, source code, and development plans</li>
            <li className="leading-relaxed">Business strategies, plans, and methods</li>
            <li className="leading-relaxed">User credentials and access methods</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2" id="section-3">
            3. RECIPIENT'S OBLIGATIONS
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">Recipient agrees to:</p>
          
          <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200" aria-label="Recipient obligations">
            <li className="leading-relaxed">Maintain the confidentiality of all Confidential Information</li>
            <li className="leading-relaxed">Not disclose any Confidential Information to any third party</li>
            <li className="leading-relaxed">Not use any Confidential Information for any purpose except to evaluate and use the application as intended</li>
            <li className="leading-relaxed">Not reverse engineer, decompile, or disassemble the application</li>
            <li className="leading-relaxed">Not share access credentials with any other person</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2" id="section-4">
            4. TERM
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            The obligations of Recipient under this Agreement shall survive for a period of three (3) years 
            from the date of disclosure of the Confidential Information.
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2" id="section-5">
            5. DIGITAL SIGNATURE
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            By entering my name and email address and clicking "I Agree," I acknowledge that I am creating an 
            electronic signature that will have the same legal effect and enforceability as a handwritten signature.
          </p>
        </section>
        
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-6">
          <p className="font-bold text-gray-900 dark:text-amber-100 text-center text-base">
            BY ACCESSING THIS APPLICATION, YOU ARE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.
          </p>
        </div>
      </div>
    </div>
  );
};
