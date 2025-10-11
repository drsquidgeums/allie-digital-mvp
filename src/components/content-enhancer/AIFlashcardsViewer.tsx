import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIFlashcard {
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

interface AIFlashcardsViewerProps {
  flashcards: AIFlashcard[];
}

export const AIFlashcardsViewer = ({ flashcards }: AIFlashcardsViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No flashcards generated yet
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <Badge className={difficultyColors[currentCard.difficulty]}>
          {currentCard.difficulty}
        </Badge>
      </div>

      <Card
        className="p-8 min-h-[300px] flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {isFlipped ? "Answer" : "Question"}
          </p>
          <p className="text-lg">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
        </div>
      </Card>

      <div className="flex gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={flashcards.length === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Flip
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={flashcards.length === 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
