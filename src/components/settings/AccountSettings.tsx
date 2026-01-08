
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Calendar, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";

export const AccountSettings = () => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || null);
          
          // Fetch profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('created_at, subscription_status')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setMemberSince(profile.created_at);
            setSubscriptionStatus(profile.subscription_status);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleViewBilling = async () => {
    setIsLoadingPortal(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t('settings.account.notLoggedIn', 'Please log in to access billing'));
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes('No Stripe customer found')) {
          toast.error(t('settings.account.noStripeCustomer', 'No billing history available. Your payment may have been processed externally.'));
        } else {
          throw new Error(data.error);
        }
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening billing portal:', error);
      toast.error(t('settings.account.billingError', 'Unable to open billing portal. Please try again.'));
    } finally {
      setIsLoadingPortal(false);
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
              ) : (
                <Badge variant="secondary">
                  {t('settings.account.noSubscription', 'No Active Plan')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* View Billing Button */}
        {subscriptionStatus === 'lifetime' && (
          <Button
            variant="outline"
            onClick={handleViewBilling}
            disabled={isLoadingPortal}
            className="w-full sm:w-auto"
          >
            {isLoadingPortal ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4 mr-2" />
            )}
            {t('settings.account.viewBilling', 'View Billing History')}
          </Button>
        )}
      </div>
      <Separator />
    </div>
  );
};
