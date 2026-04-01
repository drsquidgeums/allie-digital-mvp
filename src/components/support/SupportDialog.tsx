import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportDialog = ({ open, onOpenChange }: SupportDialogProps) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType || !description.trim()) {
      toast.error(t("support.validationError", "Please fill in all fields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-support-ticket", {
        body: {
          issueType,
          description: description.trim(),
        },
      });

      if (error) throw error;

      toast.success(t("support.success", "Support ticket submitted successfully!"));
      setIssueType("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      toast.error(t("support.error", "Failed to submit support ticket. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("support.title", "Contact Support")}</DialogTitle>
          <DialogDescription>
            {t("support.description", "Submit a support ticket and we'll get back to you as soon as possible.")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("support.email", "Your Email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("support.emailPlaceholder", "your@email.com")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("support.subject", "Subject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("support.subjectPlaceholder", "Brief summary of your issue")}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issueType">{t("support.issueType", "Issue Type")}</Label>
            <Select value={issueType} onValueChange={setIssueType} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder={t("support.selectIssueType", "Select issue type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">{t("support.bugReport", "Bug Report")}</SelectItem>
                <SelectItem value="feature">{t("support.featureRequest", "Feature Request")}</SelectItem>
                <SelectItem value="account">{t("support.accountIssue", "Account / Payment Issue")}</SelectItem>
                <SelectItem value="general">{t("support.generalQuestion", "General Question")}</SelectItem>
                <SelectItem value="feedback">{t("support.generalFeedback", "General Feedback")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t("support.descriptionLabel", "Description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("support.descriptionPlaceholder", "Please describe your issue in detail...")}
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          <div className="rounded-md bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
            <p>{t("support.notice", "Please note: Allie.ai is an open source, self-funded platform. Your support request may take up to 7 working days for a response. Thank you for your patience!")}</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("support.submitting", "Submitting...")}
                </>
              ) : (
                t("support.submit", "Submit Ticket")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
