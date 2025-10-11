import { useState } from "react";
import { useAIStudyMaterials, MaterialType } from "@/hooks/useAIStudyMaterials";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Brain, FileQuestion, FileText, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIFlashcardsViewer } from "./AIFlashcardsViewer";
import { AIQuizViewer } from "./AIQuizViewer";
import { AISummaryViewer } from "./AISummaryViewer";
import { AIMnemonicsViewer } from "./AIMnemonicsViewer";

interface AIStudyMaterialsTabProps {
  documentContent?: string;
}

export const AIStudyMaterialsTab = ({ documentContent }: AIStudyMaterialsTabProps) => {
  const { isGenerating, generateMaterial } = useAIStudyMaterials();
  const [activeTab, setActiveTab] = useState<MaterialType>("flashcards");
  const [flashcards, setFlashcards] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [mnemonics, setMnemonics] = useState<any>(null);

  const handleGenerate = async (type: MaterialType) => {
    if (!documentContent) return;
    
    const result = await generateMaterial({
      sourceText: documentContent,
      materialType: type,
    });

    if (result) {
      switch (type) {
        case "flashcards":
          setFlashcards(result);
          break;
        case "quiz":
          setQuiz(result);
          break;
        case "summary":
          setSummary(result);
          break;
        case "mnemonics":
          setMnemonics(result);
          break;
      }
      setActiveTab(type);
    }
  };

  if (!documentContent) {
    return (
      <div className="p-6 text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Load a document to generate AI-powered study materials
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Study Materials</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Generate comprehensive study materials powered by AI
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerate("flashcards")}
            disabled={isGenerating}
            className="text-xs gap-2"
          >
            {isGenerating && activeTab === "flashcards" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Brain className="h-3 w-3" />
            )}
            Flashcards
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerate("quiz")}
            disabled={isGenerating}
            className="text-xs gap-2"
          >
            {isGenerating && activeTab === "quiz" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <FileQuestion className="h-3 w-3" />
            )}
            Quiz
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerate("summary")}
            disabled={isGenerating}
            className="text-xs gap-2"
          >
            {isGenerating && activeTab === "summary" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <FileText className="h-3 w-3" />
            )}
            Summary
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerate("mnemonics")}
            disabled={isGenerating}
            className="text-xs gap-2"
          >
            {isGenerating && activeTab === "mnemonics" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Lightbulb className="h-3 w-3" />
            )}
            Memory Aids
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MaterialType)} className="h-full">
          <TabsList className="w-full grid grid-cols-4 mx-4 mt-2">
            <TabsTrigger value="flashcards" className="text-xs">Cards</TabsTrigger>
            <TabsTrigger value="quiz" className="text-xs">Quiz</TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
            <TabsTrigger value="mnemonics" className="text-xs">Memory</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="flashcards" className="mt-0">
              {flashcards ? (
                <AIFlashcardsViewer flashcards={flashcards.flashcards || []} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Click "Flashcards" to generate AI-powered study cards
                </div>
              )}
            </TabsContent>
            <TabsContent value="quiz" className="mt-0">
              {quiz ? (
                <AIQuizViewer questions={quiz.questions || []} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Click "Quiz" to generate AI-powered practice questions
                </div>
              )}
            </TabsContent>
            <TabsContent value="summary" className="mt-0">
              {summary ? (
                <AISummaryViewer summary={summary} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Click "Summary" to generate AI-powered study summary
                </div>
              )}
            </TabsContent>
            <TabsContent value="mnemonics" className="mt-0">
              {mnemonics ? (
                <AIMnemonicsViewer mnemonics={mnemonics.mnemonics || []} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Click "Memory Aids" to generate helpful mnemonics
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
