
import { BookOpen, Mic, Eye, Timer, Text, SpellCheck } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";
import { BionicReader } from "../BionicReader";
import { TextToSpeech } from "../TextToSpeech";
import { PomodoroTimer } from "../PomodoroTimer";
import { BeelineReader } from "../BeelineReader";
import { FocusMode } from "../FocusMode";
import { SpeechToText } from "../SpeechToText";
import { Rewordify } from "../Rewordify";

export const ToolbarTools = () => {
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
    </div>
  );
};
