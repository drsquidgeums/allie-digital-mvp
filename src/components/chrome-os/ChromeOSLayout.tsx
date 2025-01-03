import React, { useState } from "react";
import { Shelf } from "./Shelf";
import { SystemTray } from "./SystemTray";
import { Launcher } from "./Launcher";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const ChromeOSLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  return (
    <div className="min-h-screen bg-workspace dark:bg-workspace-dark">
      {/* Top bar */}
      <div className="h-12 bg-workspace-dark/80 backdrop-blur-sm border-b flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-4"
          onClick={() => setIsLauncherOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <SystemTray />
      </div>

      {/* Main content */}
      <main className="pt-12 pb-12 min-h-screen">
        {children}
      </main>

      {/* Bottom shelf */}
      <Shelf />

      {/* Launcher overlay */}
      <Launcher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
    </div>
  );
};