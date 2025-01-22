import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const KeyboardSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Toggle Focus Mode</Label>
            <Input defaultValue="Ctrl + F" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Open Settings</Label>
            <Input defaultValue="Ctrl + ," readOnly />
          </div>
          <div className="space-y-2">
            <Label>Save Document</Label>
            <Input defaultValue="Ctrl + S" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Toggle Theme</Label>
            <Input defaultValue="Ctrl + T" readOnly />
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};