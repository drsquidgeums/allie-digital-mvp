
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RatingSelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const RatingSelect: React.FC<RatingSelectProps> = ({
  label,
  value,
  onChange
}) => {
  const ratingOptions = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>
      <div className="flex justify-between gap-2">
        {ratingOptions.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${value === option.value ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
