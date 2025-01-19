import React from "react";

export const SidebarLogo = React.memo(() => (
  <div 
    className="flex items-center gap-3 mb-4 px-2"
    role="banner"
  >
    <img 
      src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
      alt="Allie Digital Logo" 
      className="w-12 h-12"
    />
    <span className="text-sm font-medium text-foreground">Username</span>
  </div>
));

SidebarLogo.displayName = "SidebarLogo";