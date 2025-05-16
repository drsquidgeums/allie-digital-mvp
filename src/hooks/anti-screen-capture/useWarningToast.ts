
import { useToast } from '@/hooks/use-toast';

export const useWarningToast = () => {
  const { toast } = useToast();
  
  const showWarning = () => {
    toast({
      title: "Screenshot Detected",
      description: "Screenshots and screen recordings are prohibited under the NDA agreement.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return { showWarning };
};
