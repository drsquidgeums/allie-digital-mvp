import { TextSelect, Speaker, Eye, Palette, Focus, Timer, SpeakerOff, Camera } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";
import { BionicReader } from "../BionicReader";
import { TextToSpeech } from "../TextToSpeech";
import { PomodoroTimer } from "../PomodoroTimer";
import { ColorSeparator } from "../ColorSeparator";
import { FocusMode } from "../FocusMode";
import { SpeechToText } from "../SpeechToText";
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";

export const ToolbarTools = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleScreenshot = async () => {
    try {
      const documentElement = document.querySelector('[role="document"]');
      if (!documentElement) {
        toast({
          title: "Error",
          description: "No document found to capture",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(documentElement, {
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.download = `screenshot-${new Date().toISOString()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Screenshot captured",
        description: "Your screenshot has been downloaded",
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      toast({
        title: "Screenshot failed",
        description: "Failed to capture screenshot",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ToolItem
        icon={Eye}
        label={t('tools.bionic')}
        id="bionic"
        content={<BionicReader />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Speaker}
        label={t('tools.tts')}
        id="tts"
        content={<TextToSpeech />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={SpeakerOff}
        label={t('tools.stt')}
        id="stt"
        content={<SpeechToText />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Timer}
        label={t('tools.pomodoro')}
        id="pomodoro"
        content={<PomodoroTimer />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Palette}
        label={t('tools.color')}
        id="color"
        content={<ColorSeparator onColorChange={() => {}} />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Focus}
        label={t('tools.focus')}
        id="focus"
        content={<FocusMode />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Camera}
        label={t('tools.screenshot')}
        id="screenshot"
        onClick={handleScreenshot}
      />
    </div>
  );
};