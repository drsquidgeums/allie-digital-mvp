
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackResponse } from "@/types/feedback";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [rating, setRating] = useState(3);
  const [usability, setUsability] = useState(50);
  const [visualAppeal, setVisualAppeal] = useState(50);
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already submitted feedback
    const checkFeedback = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return;

        const { data } = await supabase
          .from('feedback')
          .select()
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        // If user has submitted feedback before, don't show dialog
        if (data) {
          onOpenChange(false);
          localStorage.setItem('feedbackSubmitted', 'true');
        }
      } catch (error) {
        console.error('Error checking feedback:', error);
      }
    };

    if (open) {
      checkFeedback();
    }
  }, [open, onOpenChange]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be signed in to submit feedback",
          variant: "destructive",
        });
        return;
      }

      const feedback: FeedbackResponse = {
        userId: session.session.user.id,
        rating,
        usability,
        visualAppeal,
        wouldRecommend,
        comments,
      };

      const { error } = await supabase.from('feedback').insert({
        user_id: feedback.userId,
        rating: feedback.rating,
        usability: feedback.usability,
        visual_appeal: feedback.visualAppeal,
        would_recommend: feedback.wouldRecommend,
        comments: feedback.comments,
      });

      if (error) throw error;

      localStorage.setItem('feedbackSubmitted', 'true');
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error Submitting Feedback",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Please take a moment to rate your experience with our application.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Overall Experience</Label>
            <RadioGroup value={String(rating)} onValueChange={(value) => setRating(Number(value))} className="flex justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center">
                  <RadioGroupItem value={String(value)} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`} className="mt-1">{value}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Usability</Label>
            <Slider
              value={[usability]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setUsability(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Difficult</span>
              <span>Easy</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Visual Appeal</Label>
            <Slider
              value={[visualAppeal]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVisualAppeal(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="recommend"
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
            <Label htmlFor="recommend">I would recommend this application to others</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Please share any thoughts or suggestions..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Skip
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
