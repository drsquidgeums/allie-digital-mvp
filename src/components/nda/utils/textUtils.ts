
export const getNdaPlainText = (): string => {
  // Extract the plain text from the NDA for text-to-speech
  return `
    Non-Disclosure Agreement.
    Effective Date: May 16, 2025.
    
    1. CONFIDENTIALITY AGREEMENT
    This Non-Disclosure Agreement is entered into by and between Allie Digital Ltd 
    ("Disclosing Party") and you, the individual accessing this application ("Recipient").
    
    2. CONFIDENTIAL INFORMATION
    "Confidential Information" means any and all information disclosed to Recipient by the Disclosing 
    Party, either directly or indirectly, in writing, orally, or by inspection of tangible or intangible 
    objects, including but not limited to:
    - The application, its features, functionality, and user interface
    - Documents, content, and data accessible through the application
    - Technical specifications, algorithms, source code, and development plans
    - Business strategies, plans, and methods
    - User credentials and access methods
    
    3. RECIPIENT'S OBLIGATIONS
    Recipient agrees to:
    - Maintain the confidentiality of all Confidential Information
    - Not disclose any Confidential Information to any third party
    - Not use any Confidential Information for any purpose except to evaluate and use the application as intended
    - Not reverse engineer, decompile, or disassemble the application
    - Not share access credentials with any other person
    
    4. TERM
    The obligations of Recipient under this Agreement shall survive for a period of three years 
    from the date of disclosure of the Confidential Information.
    
    5. DIGITAL SIGNATURE
    By entering my name and email address and clicking "I Agree," I acknowledge that I am creating an 
    electronic signature that will have the same legal effect and enforceability as a handwritten signature.
    
    BY ACCESSING THIS APPLICATION, YOU ARE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.
  `;
};
