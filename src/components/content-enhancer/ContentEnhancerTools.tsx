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
  const { toast } = useToast();

  const SAVED_KEY = 'saved_learning_content';

  const saveContent = () => {
    const data = { flashcards, quizQuestions, practiceQuestions, savedAt: new Date().toISOString() };
    localStorage.setItem(SAVED_KEY, JSON.stringify(data));
    toast({ title: 'Learning content saved!', description: 'You can access it later even after closing the panel.' });
  };

  const loadSaved = () => {
    const saved = localStorage.getItem(SAVED_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.flashcards?.length) setFlashcards(data.flashcards);
        if (data.quizQuestions?.length) setQuizQuestions(data.quizQuestions);
        if (data.practiceQuestions?.length) setPracticeQuestions(data.practiceQuestions);
        toast({ title: 'Previous content loaded!' });
      } catch {}
    }
  };

  const exportAsPdf = () => {
    let text = '# AI Learning Content\n\n';
    if (flashcards.length) {
      text += '## Flashcards\n\n';
      flashcards.forEach((c, i) => { text += `${i + 1}. Q: ${c.front}\n   A: ${c.back}\n   Category: ${c.category}\n\n`; });
    }
    if (quizQuestions.length) {
      text += '## Quiz Questions\n\n';
      quizQuestions.forEach((q, i) => {
        text += `${i + 1}. ${q.question}\n`;
        q.options.forEach((o, j) => { text += `   ${j === q.correctAnswer ? '✓' : ' '} ${String.fromCharCode(65 + j)}) ${o}\n`; });
        text += `   Explanation: ${q.explanation}\n\n`;
      });
    }
    if (practiceQuestions.length) {
      text += '## Practice Questions\n\n';
      practiceQuestions.forEach((q, i) => {
        text += `${i + 1}. [${q.difficulty}] ${q.question}\n   Suggested: ${q.suggestedAnswer}\n\n`;
      });
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learning-content.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load saved content on mount
  useState(() => { loadSaved(); });

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
        {(flashcards.length > 0 || quizQuestions.length > 0 || practiceQuestions.length > 0) && (
          <div className="flex gap-2 px-4">
            <Button size="sm" variant="ghost" onClick={saveContent} className="text-xs gap-1">
              <Save className="h-3 w-3" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={exportAsPdf} className="text-xs gap-1">
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
        )}

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
