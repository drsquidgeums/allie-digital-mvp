
import React from "react";

export const NdaText: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 p-4 rounded-lg">
      <p className="font-semibold text-gray-900 dark:text-white">Effective Date: May 16, 2025</p>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="section-1">1. CONFIDENTIALITY AGREEMENT</h3>
      
      <p className="text-gray-800 dark:text-gray-100">
        This Non-Disclosure Agreement ("Agreement") is entered into by and between Allie Digital Ltd 
        ("Disclosing Party") and you, the individual accessing this application ("Recipient").
      </p>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="section-2">2. CONFIDENTIAL INFORMATION</h3>
      
      <p className="text-gray-800 dark:text-gray-100">
        "Confidential Information" means any and all information disclosed to Recipient by the Disclosing 
        Party, either directly or indirectly, in writing, orally, or by inspection of tangible or intangible 
        objects, including but not limited to:
      </p>
      
      <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-100" aria-label="Confidential information items">
        <li>The application, its features, functionality, and user interface</li>
        <li>Documents, content, and data accessible through the application</li>
        <li>Technical specifications, algorithms, source code, and development plans</li>
        <li>Business strategies, plans, and methods</li>
        <li>User credentials and access methods</li>
      </ul>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="section-3">3. RECIPIENT'S OBLIGATIONS</h3>
      
      <p className="text-gray-800 dark:text-gray-100">Recipient agrees to:</p>
      
      <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-100" aria-label="Recipient obligations">
        <li>Maintain the confidentiality of all Confidential Information</li>
        <li>Not disclose any Confidential Information to any third party</li>
        <li>Not use any Confidential Information for any purpose except to evaluate and use the application as intended</li>
        <li>Not reverse engineer, decompile, or disassemble the application</li>
        <li>Not share access credentials with any other person</li>
      </ul>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="section-4">4. TERM</h3>
      
      <p className="text-gray-800 dark:text-gray-100">
        The obligations of Recipient under this Agreement shall survive for a period of three (3) years 
        from the date of disclosure of the Confidential Information.
      </p>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="section-5">5. DIGITAL SIGNATURE</h3>
      
      <p className="text-gray-800 dark:text-gray-100">
        By entering my name and email address and clicking "I Agree," I acknowledge that I am creating an 
        electronic signature that will have the same legal effect and enforceability as a handwritten signature.
      </p>
      
      <p className="mt-4 font-bold text-gray-900 dark:text-white">
        BY ACCESSING THIS APPLICATION, YOU ARE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.
      </p>
    </div>
  );
};
