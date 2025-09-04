import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Brain, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import { aiEnhancementService, AIInsight } from '@/services/ai/AIEnhancementService';

interface DocumentIntelligenceProps {
  documentContent?: string;
  documentType?: string;
  fileName?: string;
  className?: string;
}

export const DocumentIntelligence: React.FC<DocumentIntelligenceProps> = ({
  documentContent,
  documentType = 'general',
  fileName,
  className = ''
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeDocument = async () => {
    if (!documentContent || documentContent.length < 100) return;

    setIsAnalyzing(true);
    try {
      const documentInsights = await aiEnhancementService.analyzeDocument(
        documentContent,
        documentType
      );
      setInsights(documentInsights);
      setHasAnalyzed(true);
    } catch (error) {
      console.error('Error analyzing document:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when document content changes
  useEffect(() => {
    if (documentContent && !hasAnalyzed) {
      const timer = setTimeout(analyzeDocument, 2000); // Wait 2 seconds after content loads
      return () => clearTimeout(timer);
    }
  }, [documentContent, hasAnalyzed]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'productivity': return <TrendingUp className="w-4 h-4" />;
      case 'focus': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'learning': return 'text-blue-600 bg-blue-100 dark:bg-blue-950/30';
      case 'productivity': return 'text-green-600 bg-green-100 dark:bg-green-950/30';
      case 'focus': return 'text-purple-600 bg-purple-100 dark:bg-purple-950/30';
      default: return 'text-orange-600 bg-orange-100 dark:bg-orange-950/30';
    }
  };

  if (!documentContent) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            Document Intelligence
          </CardTitle>
          {documentContent && !isAnalyzing && (
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeDocument}
              className="h-6 text-xs"
            >
              Re-analyze
            </Button>
          )}
        </div>
        {fileName && (
          <p className="text-xs text-muted-foreground truncate">
            Analyzing: {fileName}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {isAnalyzing ? (
          <div className="flex items-center gap-2 py-4">
            <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Analyzing document for learning insights...
            </span>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={insight.id || index} className="flex items-start gap-3 p-2 rounded-lg border">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getInsightColor(insight.type)}`}>
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(insight.confidence * 100)}%
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
            
            {insights.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-6 text-xs"
                onClick={() => {
                  // Could expand to show all insights or open a modal
                  console.log('Show all insights:', insights);
                }}
              >
                View {insights.length - 3} more insights
              </Button>
            )}
          </div>
        ) : hasAnalyzed ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              No specific learning insights found for this document.
            </p>
          </div>
        ) : (
          <div className="py-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeDocument}
              disabled={!documentContent || documentContent.length < 100}
            >
              <Brain className="w-4 h-4 mr-2" />
              Analyze Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};