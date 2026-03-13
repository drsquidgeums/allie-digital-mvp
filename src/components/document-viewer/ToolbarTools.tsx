
import { Timer, Text, Wand2, Sparkles, Bot, GraduationCap } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";
import { PomodoroTimer } from "../PomodoroTimer";
import { SpeechToText } from "../SpeechToText";
import { Rewordify } from "../Rewordify";
import { IrlenOverlay } from "../IrlenOverlay";
import { AmbientMusic } from "../AmbientMusic";
import { TextTool } from "./toolbar/TextTool";
import { DocumentAIChat } from "../ai/DocumentAIChat";
import { VoiceAssistant } from "../voice/VoiceAssistant";
import { ContentEnhancerTools } from "../content-enhancer/ContentEnhancerTools";
import { BionicToggleButton } from "./toolbar/BionicToggleButton";
import { TTSButton } from "./toolbar/TTSButton";
import { BeelineToggleButton } from "./toolbar/BeelineToggleButton";
import { AICreditsIndicator } from "./toolbar/AICreditsIndicator";

interface ToolbarToolsProps {
  documentContent?: string;
  documentName?: string;
}

export const ToolbarTools = ({ documentContent, documentName }: ToolbarToolsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <AICreditsIndicator />
      <div data-tour="bionic">
        <BionicToggleButton />
      </div>
      <div data-tour="beeline">
        <BeelineToggleButton />
      </div>
      <div data-tour="tts">
        <TTSButton />
      </div>
      <div data-tour="stt">
        <ToolItem
          icon={Text}
          label={t('tools.stt')}
          id="stt"
          content={<SpeechToText />}
          popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="pomodoro">
        <ToolItem
          icon={Timer}
          label={t('tools.pomodoro')}
          id="pomodoro"
          content={<PomodoroTimer />}
          popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="irlen">
        <IrlenOverlay />
      </div>
      <div data-tour="text-options">
        <TextTool />
      </div>
      <div data-tour="ai-simplify">
        <ToolItem
          icon={Wand2}
          label="AI Simplify"
          id="rewordify"
          content={<Rewordify />}
          popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="document-ai">
        <ToolItem
          icon={Sparkles}
          label="Document AI"
          id="ai-assistant"
          content={
            <DocumentAIChat
              documentContent={documentContent}
              documentName={documentName}
            />
          }
          popoverClassName="w-96 h-[600px] p-0 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="voice-ai">
        <ToolItem
          icon={Bot}
          label={t('tools.voice') || 'Voice AI'}
          id="voice-assistant"
          content={<VoiceAssistant />}
          popoverClassName="w-96 p-0 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="learning-ai">
        <ToolItem
          icon={GraduationCap}
          label="Learning AI"
          id="learning-tools"
          content={
            <ContentEnhancerTools
              documentContent={documentContent}
            />
          }
          popoverClassName="w-[500px] h-[600px] p-0 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
        />
      </div>
      <div data-tour="ambient">
        <AmbientMusic />
      </div>
    </div>
  );
};
