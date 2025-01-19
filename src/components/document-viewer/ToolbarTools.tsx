import React from "react";
import { TextSelect, Volume2, Brain, Palette, Focus } from "lucide-react";
import { ToolItem } from "./toolbar/ToolItem";
import { useTranslation } from "react-i18next";

export const ToolbarTools = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <ToolItem
        icon={Brain}
        label={t('tools.bionic')}
        id="bionic"
      />
      <ToolItem
        icon={Volume2}
        label={t('tools.tts')}
        id="tts"
      />
      <ToolItem
        icon={Palette}
        label={t('tools.color')}
        id="color"
      />
      <ToolItem
        icon={Focus}
        label={t('tools.focus')}
        id="focus"
      />
    </div>
  );
};