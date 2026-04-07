
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { User, Calendar, CreditCard, Loader2, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AccountSettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || null);

          // Fetch profile data
          const { data: profile } = await supabase
            .from("profiles")
            .select("created_at, subscription_status")
            .eq("id", user.id)
            .single();

          if (profile) {
            setMemberSince(profile.created_at);
            setSubscriptionStatus(profile.subscription_status);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-user-data");
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `allie-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Data exported", description: "Your data has been downloaded successfully." });
    } catch (error) {
      console.error("Export error:", error);
      toast({ title: "Export failed", description: "Failed to export your data. Please try again.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;

      toast({ title: "Account deleted", description: "Your account and all data have been permanently deleted." });
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Deletion failed", description: "Failed to delete your account. Please try again.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('settings.account.title', 'Account')}</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <Separator />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.account.title', 'Account')}</h3>
      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-0.5">
            <Label className="text-sm text-muted-foreground">{t('settings.account.email', 'Email')}</Label>
            <p className="text-sm font-medium">{userEmail || '-'}</p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-0.5">
            <Label className="text-sm text-muted-foreground">{t('settings.account.memberSince', 'Member Since')}</Label>
            <p className="text-sm font-medium">
              {memberSince ? format(new Date(memberSince), 'MMMM d, yyyy') : '-'}
            </p>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="flex items-center gap-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-0.5">
            <Label className="text-sm text-muted-foreground">{t('settings.account.plan', 'Plan')}</Label>
            <div className="flex items-center gap-2">
              {subscriptionStatus === 'lifetime' ? (
                <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/20 border-green-500/30">
                  {t('settings.account.lifetimeAccess', 'Lifetime Access')}
                </Badge>
              ) : subscriptionStatus === 'trial' ? (
                <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 border-amber-500/30">
                  7 Day Trial
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {t('settings.account.noSubscription', 'No Active Plan')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {t('settings.account.exportData', 'Export My Data')}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {t('settings.account.deleteAccount', 'Delete Account')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('settings.account.deleteConfirmTitle', 'Are you absolutely sure?')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('settings.account.deleteConfirmDescription', 'This action cannot be undone. This will permanently delete your account and remove all of your data from our servers, including your tasks, files, and AI usage history.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('settings.account.deleteConfirmButton', 'Yes, delete my account')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
    </div>
  );
};
