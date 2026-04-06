import { useState } from "react";
import { useContentEnhancer, Flashcard, QuizQuestion, PracticeQuestion } from "@/hooks/useContentEnhancer";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Download, Save } from "lucide-react";
import { FlashcardViewer } from "./FlashcardViewer";
import { QuizViewer } from "./QuizViewer";
import { PracticeQuestionsViewer } from "./PracticeQuestionsViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ContentEnhancerToolsProps {
  documentContent?: string;
}

export const ContentEnhancerTools = ({ documentContent }: ContentEnhancerToolsProps) => {
  const { isLoading, generateFlashcards, generateQuiz, generatePracticeQuestions } = useContentEnhancer();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [activeTab, setActiveTab] = useState("flashcards");

  const handleGenerateFlashcards = async () => {
    if (!documentContent) return;
    const cards = await generateFlashcards(documentContent);
    setFlashcards(cards);
    setActiveTab("flashcards");
  };

  const handleGenerateQuiz = async () => {
    if (!documentContent) return;
    const questions = await generateQuiz(documentContent);
    setQuizQuestions(questions);
    setActiveTab("quiz");
  };

  const handleGeneratePractice = async () => {
    if (!documentContent) return;
    const questions = await generatePracticeQuestions(documentContent);
    setPracticeQuestions(questions);
    setActiveTab("practice");
  };

  if (!documentContent) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Load a document to generate learning content
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Learning Tools
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateFlashcards}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Flashcards"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateQuiz}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Quiz"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGeneratePractice}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Practice"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full grid grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="flashcards" className="mt-0">
              <FlashcardViewer flashcards={flashcards} />
            </TabsContent>
            <TabsContent value="quiz" className="mt-0">
              <QuizViewer questions={quizQuestions} />
            </TabsContent>
            <TabsContent value="practice" className="mt-0">
              <PracticeQuestionsViewer questions={practiceQuestions} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
