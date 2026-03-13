import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarContent } from "./sidebar/SidebarContent";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarButton } from "./sidebar/SidebarButton";
import { SupportDialog } from "./support/SupportDialog";
import { SidebarAICredits } from "./sidebar/SidebarAICredits";
import { SidebarTrialBadge } from "./sidebar/SidebarTrialBadge";
import { Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  onColorChange: (color: string) => void;
  trialActive?: boolean;
  trialDaysRemaining?: number | null;
}

export const Sidebar = React.memo(({ 
  onColorChange,
  trialActive,
  trialDaysRemaining
}: SidebarProps) => {
  const { t } = useTranslation();
  const [activeComponent, setActiveComponent] = React.useState<string | null>(null);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  
  // Get user info from localStorage
  React.useEffect(() => {
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsedAgreement = JSON.parse(ndaAgreement);
        setUserInfo({
          name: parsedAgreement.name,
          email: parsedAgreement.email
        });
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
      }
    }
  }, []);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      sidebarRef.current?.focus();
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className="w-64 bg-card border-r border-border p-4 flex flex-col h-screen overflow-y-auto relative"
      role="navigation"
      aria-label="Main navigation"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SidebarLogo />
      
      <div className="space-y-2 flex-1">
        <SidebarNavigation 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        <SidebarTools 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
      </div>
      
      <SidebarContent 
        activeComponent={activeComponent}
        onColorChange={onColorChange}
      />

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <div data-tour="ai-credits">
          <SidebarAICredits />
        </div>
        {trialActive && trialDaysRemaining !== null && (
          <SidebarTrialBadge daysRemaining={trialDaysRemaining} />
        )}
        <div data-tour="logout">
          {/* Logout is inside SidebarTools */}
        </div>
        <div data-tour="discord">
          <a
            href="https://discord.com/invite/wAwjSyqY6a"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              type="button"
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-2 transition-all duration-200 ease-in-out hover:bg-accent/50 hover:text-accent-foreground"
              role="menuitem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord</span>
            </Button>
          </a>
        </div>
        <div data-tour="support">
          <SidebarButton
            icon={Headset}
            label={t("navigation.support", "Support")}
            isActive={false}
            onClick={() => setSupportDialogOpen(true)}
          />
        </div>
        <div data-tour="theme">
          <ThemeToggle />
        </div>
      </div>
      
      <SupportDialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen} />
    </div>
  );
});

Sidebar.displayName = "Sidebar";
