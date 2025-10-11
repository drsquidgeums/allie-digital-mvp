import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Image, Music, BookText } from "lucide-react";

interface Mnemonic {
  concept: string;
  type: "acronym" | "visual" | "rhyme" | "story";
  mnemonic: string;
  explanation: string;
}

interface AIMnemonicsViewerProps {
  mnemonics: Mnemonic[];
}

const typeIcons = {
  acronym: Brain,
  visual: Image,
  rhyme: Music,
  story: BookText,
};

const typeColors = {
  acronym: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  visual: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  rhyme: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  story: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export const AIMnemonicsViewer = ({ mnemonics }: AIMnemonicsViewerProps) => {
  if (!mnemonics || mnemonics.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No mnemonics generated yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mnemonics.map((mnemonic, index) => {
        const Icon = typeIcons[mnemonic.type];
        return (
          <Card key={index} className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{mnemonic.concept}</h4>
                  <Badge className={typeColors[mnemonic.type]}>
                    {mnemonic.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mb-3">
              <p className="font-medium text-lg text-center">
                {mnemonic.mnemonic}
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">How to use: </span>
                {mnemonic.explanation}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
