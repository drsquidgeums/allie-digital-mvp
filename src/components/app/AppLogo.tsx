
import React from "react";

const AppLogo = React.memo(() => (
  <div 
    className="fixed top-0 left-0 w-64 bg-card z-50 p-4 flex items-center gap-3 border-b border-r border-border"
    role="banner"
  >
    <img 
      src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
      alt="Allie Digital Logo" 
      className="w-12 h-12"
    />
    <span className="text-sm font-medium text-foreground">allie.ai v1.0</span>
  </div>
));

AppLogo.displayName = "AppLogo";

export default AppLogo;
export { AppLogo };
