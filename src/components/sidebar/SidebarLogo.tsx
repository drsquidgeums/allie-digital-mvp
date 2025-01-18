import React from "react";
import { LanguageSwitcher } from "../LanguageSwitcher";

export const SidebarLogo = React.memo(() => (
  <div 
    className="flex items-center justify-between mb-4 px-2"
    role="banner"
  >
    <img 
      src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
      alt="Allie Digital Logo" 
      className="w-12 h-12"
    />
    <LanguageSwitcher />
  </div>
));

SidebarLogo.displayName = "SidebarLogo";