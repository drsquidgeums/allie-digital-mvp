import { TextSelect, Mic, Eye, Palette, Focus, Timer } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";
import { BionicReader } from "../BionicReader";
import { TextToSpeech } from "../TextToSpeech";
import { PomodoroTimer } from "../PomodoroTimer";
import { ColorSeparator } from "../ColorSeparator";
import { FocusMode } from "../FocusMode";

export const ToolbarTools = () => {
  const { t } = useTranslation();

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
        icon={Mic}
        label={t('tools.tts')}
        id="tts"
        content={<TextToSpeech />}
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
    </div>
  );
};