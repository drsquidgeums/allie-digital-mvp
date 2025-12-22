
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { connectToTeams } from "@/utils/teamsIntegration";
import { useToast } from "@/hooks/use-toast";
import { IntegrationItem } from "./integration/IntegrationItem";
import { useTranslation } from "react-i18next";

export const IntegrationSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleTeamsConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToTeams();
      toast({
        title: t('settings.integrations.microsoftTeams', 'Microsoft Teams'),
        description: t('settings.integrations.teamsSuccessConnect', 'Successfully initiated Teams connection. Please complete authentication in the popup window.'),
      });
    } catch (error) {
      toast({
        title: t('settings.integrations.connectionError', 'Connection Error'),
        description: t('settings.integrations.teamsConnectError', 'Failed to connect to Microsoft Teams. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const integrations = [
    {
      title: t('settings.integrations.googleCalendar', 'Google Calendar'),
      description: t('settings.integrations.googleCalendarDesc', 'Sync tasks with Google Calendar'),
      disabled: true,
    },
    {
      title: t('settings.integrations.microsoftTeams', 'Microsoft Teams'),
      description: t('settings.integrations.teamsDesc', 'Connect to Teams chat channels for collaborative discussions'),
      disabled: true,
    },
    {
      title: t('settings.integrations.slack', 'Slack'),
      description: t('settings.integrations.slackDesc', 'Connect with Slack workspace'),
      disabled: true,
    },
    {
      title: t('settings.integrations.canvasLMS', 'Canvas LMS'),
      description: t('settings.integrations.canvasDesc', 'Sync with your Canvas courses and assignments'),
      disabled: true,
    },
    {
      title: t('settings.integrations.googleClassroom', 'Google Classroom'),
      description: t('settings.integrations.classroomDesc', 'Connect and sync with Google Classroom'),
      disabled: true,
    },
    {
      title: t('settings.integrations.blackboard', 'Blackboard'),
      description: t('settings.integrations.blackboardDesc', 'Sync with Blackboard courses and assignments'),
      disabled: true,
    },
    {
      title: t('settings.integrations.trello', 'Trello'),
      description: t('settings.integrations.trelloDesc', 'Sync tasks with Trello boards'),
      disabled: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('settings.integrations.title', 'Integrations')}</h3>
      <div className="space-y-6">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.title}
            title={integration.title}
            description={integration.description}
            disabled={integration.disabled}
          />
        ))}
      </div>
      <Separator />
    </div>
  );
};
