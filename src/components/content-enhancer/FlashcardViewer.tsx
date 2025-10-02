import { useState } from "react";
import { Flashcard } from "@/hooks/useContentEnhancer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
}

export const FlashcardViewer = ({ flashcards }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards.length) {
    return <div className="text-sm text-muted-foreground">No flashcards generated yet</div>;
  }

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
          {current.category}
        </span>
      </div>

      <Card
        className="min-h-[200px] p-6 cursor-pointer flex items-center justify-center text-center transition-all hover:shadow-lg"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {isFlipped ? "Answer:" : "Question:"}
          </div>
          <div className="text-lg">{isFlipped ? current.back : current.front}</div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Flip
        </Button>

        <Button variant="outline" size="sm" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
