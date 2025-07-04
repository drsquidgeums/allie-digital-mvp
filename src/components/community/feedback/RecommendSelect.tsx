
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RecommendSelectProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export const RecommendSelect: React.FC<RecommendSelectProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Would you recommend this application?</Label>
      <RadioGroup 
        value={value === null ? undefined : value.toString()} 
        onValueChange={(val) => onChange(val === "true")}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="recommend-yes" />
          <Label htmlFor="recommend-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="recommend-no" />
          <Label htmlFor="recommend-no">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
