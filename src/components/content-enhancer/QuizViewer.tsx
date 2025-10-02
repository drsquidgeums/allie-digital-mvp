import { useState } from "react";
import { QuizQuestion } from "@/hooks/useContentEnhancer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface QuizViewerProps {
  questions: QuizQuestion[];
}

export const QuizViewer = ({ questions }: QuizViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  if (!questions.length) {
    return <div className="text-sm text-muted-foreground">No quiz questions generated yet</div>;
  }

  const current = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = answeredQuestions.size === questions.length;

  const handleAnswerSelect = (index: number) => {
    if (answeredQuestions.has(currentIndex)) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === current.correctAnswer) {
      setScore(score + 1);
    }

    setAnsweredQuestions(new Set(answeredQuestions).add(currentIndex));
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  if (allAnswered && isLastQuestion && showExplanation) {
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center space-y-4">
          <h3 className="text-2xl font-semibold">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-primary">
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground">
            You scored {Math.round((score / questions.length) * 100)}%
          </p>
          <Button onClick={handleReset} className="mt-4">
            Retake Quiz
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium">
          Score: {score}/{answeredQuestions.size}
        </span>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-medium text-lg">{current.question}</h3>

        <div className="space-y-2">
          {current.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === current.correctAnswer;
            const showResult = showExplanation;

            let variant: "outline" | "default" = "outline";
            let className = "w-full justify-start text-left h-auto py-3 px-4";

            if (showResult) {
              if (isCorrect) {
                className += " border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrect) {
                className += " border-red-500 bg-red-500/10";
              }
            }

            return (
              <Button
                key={index}
                variant={variant}
                className={className}
                onClick={() => handleAnswerSelect(index)}
                disabled={answeredQuestions.has(currentIndex)}
              >
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
              </Button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Explanation:</p>
            <p className="text-sm text-muted-foreground">{current.explanation}</p>
          </div>
        )}
      </Card>

      {showExplanation && !isLastQuestion && (
        <Button onClick={handleNext} className="w-full">
          Next Question
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
