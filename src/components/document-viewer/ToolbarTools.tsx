
import { BookOpen, Mic, Eye, Timer, Text, SpellCheck, Sparkles, Bot, GraduationCap } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";
import { BionicReader } from "../BionicReader";
import { TextToSpeech } from "../TextToSpeech";
import { PomodoroTimer } from "../PomodoroTimer";
import { BeelineReader } from "../BeelineReader";
import { SpeechToText } from "../SpeechToText";
import { Rewordify } from "../Rewordify";
import { IrlenOverlay } from "../IrlenOverlay";
import { TextTool } from "./toolbar/TextTool";
import { DocumentAIChat } from "../ai/DocumentAIChat";
import { VoiceAssistant } from "../voice/VoiceAssistant";
import { ContentEnhancerTools } from "../content-enhancer/ContentEnhancerTools";

interface ToolbarToolsProps {
  documentContent?: string;
  documentName?: string;
}

export const ToolbarTools = ({ documentContent, documentName }: ToolbarToolsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <ToolItem
        icon={Eye}
        label={t('tools.bionic')}
        id="bionic"
        content={<BionicReader />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Mic}
        label={t('tools.tts')}
        id="tts"
        content={<TextToSpeech />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Text}
        label={t('tools.stt')}
        id="stt"
        content={<SpeechToText />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={Timer}
        label={t('tools.pomodoro')}
        id="pomodoro"
        content={<PomodoroTimer />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={BookOpen}
        label={t('tools.beeline')}
        id="beeline"
        content={<BeelineReader />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <ToolItem
        icon={SpellCheck}
        label={t('tools.rewordify')}
        id="rewordify"
        content={<Rewordify />}
        popoverClassName="w-80 p-4 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
      <IrlenOverlay />
      <TextTool />
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
      <ToolItem
        icon={Bot}
        label={t('tools.voice') || 'Voice AI'}
        id="voice-assistant"
        content={<VoiceAssistant />}
        popoverClassName="w-96 p-0 shadow-md bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-[#FAFAFA]/20 dark:text-[#FAFAFA]"
      />
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
  );
};
