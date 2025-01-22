import React from "react";
import { Button } from "@/components/ui/button";
import { Bold } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { globalBoldState } from "@/utils/boldStateManager";

export const BoldToggle = () => {
  const [isBold, setIsBold] = React.useState(globalBoldState.isBold);
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = globalBoldState.subscribe((newValue) => {
      setIsBold(newValue);
    });
    
    // Cleanup function that properly removes the listener
    return () => {
      unsubscribe();
    };
  }, []);

  const handleBoldToggle = () => {
    const newValue = !isBold;
    globalBoldState.setBold(newValue);
    
    toast({
      title: newValue ? "Bold text enabled" : "Bold text disabled",
      description: "Font weight has been updated",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleBoldToggle}
      className={`h-10 w-10 ${isBold ? 'bg-accent text-accent-foreground ring-2 ring-primary' : 'text-foreground'}`}
      title="Toggle bold text"
      aria-pressed={isBold}
      aria-label={`${isBold ? 'Disable' : 'Enable'} bold text`}
    >
      <Bold className="h-4 w-4" />
      {isBold && (
        <div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
          role="status"
          aria-label="Bold text active"
        />
      )}
    </Button>
  );
};