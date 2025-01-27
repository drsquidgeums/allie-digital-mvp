import React from "react";

export const SidebarLogo = React.memo(() => (
  <div className="h-20" /> // This creates space for the fixed logo above
));

SidebarLogo.displayName = "SidebarLogo";