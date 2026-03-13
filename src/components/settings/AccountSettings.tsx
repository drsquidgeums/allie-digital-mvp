
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { User, Calendar, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";

export const AccountSettings = () => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      </div>
      <Separator />
    </div>
  );
};
