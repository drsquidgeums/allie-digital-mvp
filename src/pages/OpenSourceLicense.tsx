import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";
const allieLogo = "/images/allie-digital-logo.png";

const OpenSourceLicense = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
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
      
      <div className="absolute top-6 right-6 z-10">
        <img src={allieLogo} alt="Allie Digital" className="h-[130px]" />
      </div>
      
      <div className="max-w-3xl w-full relative z-10 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: '#000000' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>Open Source License</h1>
        
        <div className="prose prose-sm max-w-none space-y-6" style={{ color: '#000000' }}>
          <p className="text-sm" style={{ color: '#000000' }}>Last updated: March 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>AGPL v3 License</h2>
            <p>Allie.ai is licensed under the GNU Affero General Public License v3 (AGPL v3). This ensures the software remains open, accessible, and community driven now and in the future.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>What This Means</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The code will remain open source forever</li>
              <li>Anyone can use, study, modify, and even commercialise it</li>
              <li>BUT if you do so, any modifications must remain open source too</li>
              <li>No permission to take it private whilst using the code</li>
              <li>No permission to take the original source code to rebrand it and sell access without keeping it open source</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>Why AGPL v3?</h2>
            <p>Combined with the recent Community Interest Corporation (CIC) restructure, this setup creates dual layer protection for both the organisation and the users.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>CIC protects the organisational mission</li>
              <li>AGPL v3 ensures that the technology stays accessible</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>What This Enables</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Developers can build on the original work</li>
              <li>Educational institutions can customise for their needs</li>
              <li>The ADHD community benefits from collective improvements</li>
              <li>Everyone's contributions stay open and accessible</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>What This Doesn't Prevent</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anyone being inspired by the idea and rewriting their own code from scratch for their own purposes</li>
              <li>Legitimate private companies building similar tools</li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>Our Commitment</h2>
            <p>This setup prevents private exploitation whilst continuing to welcome genuine collaboration supported by a community driven ethos.</p>
            <p>ADHD learners, no matter what background or socioeconomic status they have, need to have access to high quality educational tools that provide them with the same opportunities and development support as everyone else.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>Source Code</h2>
            <p>The full source code is available on GitHub: <a href="https://github.com/drsquidgeums/allie-digital-mvp" className="underline" style={{ color: '#000000' }} target="_blank" rel="noopener noreferrer">github.com/drsquidgeums/allie-digital-mvp</a></p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: '#000000' }}>Full License Text</h2>
            <p>The full text of the GNU Affero General Public License v3 can be found at: <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" className="underline" style={{ color: '#000000' }} target="_blank" rel="noopener noreferrer">gnu.org/licenses/agpl-3.0.en.html</a></p>
          </section>
        </div>
      </div>
      
      <footer 
        className="text-center z-10 flex-shrink-0 mt-12"
        style={{ color: '#000000' }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© Allie Digital CIC 2026. Registered in Northern Ireland. Company No. NI718014 · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
    </div>
  );
};

export default OpenSourceLicense;