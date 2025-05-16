
import React from "react";

export const NdaText: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none text-sm text-gray-700 dark:text-gray-300">
      <p className="font-semibold">Effective Date: May 16, 2025</p>
      
      <h3 className="text-lg font-medium">1. CONFIDENTIALITY AGREEMENT</h3>
      
      <p>
        This Non-Disclosure Agreement ("Agreement") is entered into by and between Allie Digital Ltd 
        ("Disclosing Party") and you, the individual accessing this application ("Recipient").
      </p>
      
      <h3 className="text-lg font-medium">2. CONFIDENTIAL INFORMATION</h3>
      
      <p>
        "Confidential Information" means any and all information disclosed to Recipient by the Disclosing 
        Party, either directly or indirectly, in writing, orally, or by inspection of tangible or intangible 
        objects, including but not limited to:
      </p>
      
      <ul className="list-disc pl-5 space-y-1">
        <li>The application, its features, functionality, and user interface</li>
        <li>Documents, content, and data accessible through the application</li>
        <li>Technical specifications, algorithms, source code, and development plans</li>
        <li>Business strategies, plans, and methods</li>
        <li>User credentials and access methods</li>
      </ul>
      
      <h3 className="text-lg font-medium">3. RECIPIENT'S OBLIGATIONS</h3>
      
      <p>Recipient agrees to:</p>
      
      <ul className="list-disc pl-5 space-y-1">
        <li>Maintain the confidentiality of all Confidential Information</li>
        <li>Not disclose any Confidential Information to any third party</li>
        <li>Not use any Confidential Information for any purpose except to evaluate and use the application as intended</li>
        <li>Not reverse engineer, decompile, or disassemble the application</li>
        <li>Not share access credentials with any other person</li>
      </ul>
      
      <h3 className="text-lg font-medium">4. TERM</h3>
      
      <p>
        The obligations of Recipient under this Agreement shall survive for a period of three (3) years 
        from the date of disclosure of the Confidential Information.
      </p>
      
      <h3 className="text-lg font-medium">5. DIGITAL SIGNATURE</h3>
      
      <p>
        By entering my name and email address and clicking "I Agree," I acknowledge that I am creating an 
        electronic signature that will have the same legal effect and enforceability as a handwritten signature.
      </p>
      
      <p className="mt-4 font-bold">
        BY ACCESSING THIS APPLICATION, YOU ARE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.
      </p>
    </div>
  );
};
