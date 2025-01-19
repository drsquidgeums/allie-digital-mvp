import { TextSelect, Volume2, Eye, Palette, Focus, Timer } from "lucide-react";
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
      />
      <ToolItem
        icon={Volume2}
        label={t('tools.tts')}
        id="tts"
        content={<TextToSpeech />}
      />
      <ToolItem
        icon={Timer}
        label={t('tools.pomodoro')}
        id="pomodoro"
        content={<PomodoroTimer />}
      />
      <ToolItem
        icon={Palette}
        label={t('tools.color')}
        id="color"
        content={<ColorSeparator onColorChange={() => {}} />}
      />
      <ToolItem
        icon={Focus}
        label={t('tools.focus')}
        id="focus"
        content={<FocusMode />}
      />
    </div>
  );
};