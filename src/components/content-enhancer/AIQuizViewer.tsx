import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  type: "multiple_choice" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  sampleAnswer?: string;
  keyPoints?: string[];
}

interface AIQuizViewerProps {
  questions: QuizQuestion[];
}

export const AIQuizViewer = ({ questions }: AIQuizViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No quiz questions generated yet
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setSelectedAnswer(userAnswers[currentIndex + 1] ?? null);
    setCurrentIndex((prev) => prev + 1);
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Badge variant="outline">
          {currentQuestion.type === "multiple_choice" ? "Multiple Choice" : "Short Answer"}
        </Badge>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">{currentQuestion.question}</h4>

        {currentQuestion.type === "multiple_choice" && currentQuestion.options ? (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleSelectAnswer(index)}
              >
                <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Sample Answer:</p>
              <p className="text-sm">{currentQuestion.sampleAnswer}</p>
            </div>
            {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Key Points:</p>
                <ul className="text-sm space-y-1">
                  {currentQuestion.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {currentQuestion.type === "multiple_choice" && (
        <>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAnswer(!showAnswer)}
            disabled={selectedAnswer === null}
          >
            {showAnswer ? "Hide Answer" : "Check Answer"}
          </Button>

          {showAnswer && selectedAnswer !== null && (
            <Card className={`p-4 ${isCorrect ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium mb-1">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-sm">{currentQuestion.explanation}</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {currentIndex < questions.length - 1 && (
        <Button
          className="w-full"
          onClick={handleNext}
        >
          Next Question
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
