
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog-root";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPostpone: () => void;
  userInfo: { name: string; email: string } | null;
}

export const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  isOpen,
  onClose,
  onPostpone,
  userInfo
}) => {
  const [rating, setRating] = useState<number>(0);
  const [usability, setUsability] = useState<number>(0);
  const [visualAppeal, setVisualAppeal] = useState<number>(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !usability || !visualAppeal || wouldRecommend === null) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user ID if available, otherwise use a placeholder
      const user_id = userInfo?.email || "anonymous";
      
      // Store feedback in Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          { 
            user_id,
            rating,
            usability,
            visual_appeal: visualAppeal,
            would_recommend: wouldRecommend,
            comments: comments || null
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve the application."
      });
      
      // Store in localStorage that feedback was submitted
      localStorage.setItem("feedback_submitted", new Date().toISOString());
      
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const ratingOptions = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" }
  ];

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">We Value Your Feedback</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Overall Experience</Label>
              <div className="flex justify-between gap-2">
                {ratingOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={rating === option.value ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${rating === option.value ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setRating(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usability">Ease of Use</Label>
              <div className="flex justify-between gap-2">
                {ratingOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={usability === option.value ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${usability === option.value ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setUsability(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visualAppeal">Visual Design</Label>
              <div className="flex justify-between gap-2">
                {ratingOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={visualAppeal === option.value ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${visualAppeal === option.value ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setVisualAppeal(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Would you recommend this application?</Label>
              <RadioGroup 
                value={wouldRecommend === null ? undefined : wouldRecommend.toString()} 
                onValueChange={(value) => setWouldRecommend(value === "true")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="recommend-yes" />
                  <Label htmlFor="recommend-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="recommend-no" />
                  <Label htmlFor="recommend-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please share any additional thoughts or suggestions..."
                className="min-h-[100px] text-black"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={onPostpone}
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-black/80"
              >
                Ask Me Later
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-black/80"
              >
                No Thanks
              </Button>
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting || !rating || !usability || !visualAppeal || wouldRecommend === null}
              className="bg-black text-white hover:bg-black/80"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
