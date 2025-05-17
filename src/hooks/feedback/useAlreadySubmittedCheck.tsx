
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Special user email that's allowed to submit feedback multiple times
const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";

export const useAlreadySubmittedCheck = (userEmail: string | undefined | null) => {
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if the user has already submitted feedback
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!userEmail) return;

      // If this is the special user, don't restrict submissions
      if (userEmail === SPECIAL_USER_EMAIL) {
        return;
      }

      try {
        // Use explicit typing to avoid deep type inference issues
        const { data, error } = await supabase
          .from('feedback')
          .select('id')
          .eq('email', userEmail)
          .returns<{ id: string }[]>();
          
        if (error) {
          console.error("Error checking previous feedback:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setAlreadySubmitted(true);
          toast({
            title: "Feedback already submitted",
            description: "You have already provided feedback. Thank you!",
          });
        }
      } catch (error) {
        console.error("Error checking previous feedback:", error);
      }
    };
    
    checkPreviousSubmission();
  }, [userEmail, toast]);

  return { alreadySubmitted };
};
