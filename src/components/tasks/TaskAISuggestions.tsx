import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, Lightbulb, Plus } from "lucide-react";
import { useTaskAI, TaskSuggestion } from "@/hooks/useTaskAI";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TaskAISuggestionsProps {
  onAddTask: (text: string) => void;
  currentTasks?: string[];
}

export const TaskAISuggestions: React.FC<TaskAISuggestionsProps> = ({ 
  onAddTask,
  currentTasks = []
}) => {
  const { isLoading, getSuggestions, generateSchedule, optimizeTasks } = useTaskAI();
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [schedule, setSchedule] = useState<string>("");
  const [optimization, setOptimization] = useState<string>("");
  const [context, setContext] = useState("");

  const handleGetSuggestions = async () => {
    const results = await getSuggestions(context || undefined);
    setSuggestions(results);
  };

  const handleGenerateSchedule = async () => {
    const result = await generateSchedule(context || undefined);
    setSchedule(result);
  };

  const handleOptimizeTasks = async () => {
    const tasksText = currentTasks.join(", ");
    const result = await optimizeTasks(tasksText);
    setOptimization(result);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Task Assistant</CardTitle>
        </div>
        <CardDescription>
          Get intelligent suggestions, schedules, and task optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="optimize">
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe what you're studying or what you need help with (optional)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleGetSuggestions} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Get AI Suggestions"}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{suggestion.title}</p>
                            <Badge variant={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.category}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAddTask(suggestion.title)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your study goals or schedule preferences (optional)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleGenerateSchedule} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Study Schedule"}
              </Button>
            </div>

            {schedule && (
              <Card className="p-4">
                <ScrollArea className="h-[300px]">
                  <div className="whitespace-pre-wrap text-sm">
                    {schedule}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Current tasks: {currentTasks.length}
              </p>
              <Button 
                onClick={handleOptimizeTasks} 
                disabled={isLoading || currentTasks.length === 0}
                className="w-full"
              >
                {isLoading ? "Analyzing..." : "Optimize My Tasks"}
              </Button>
            </div>

            {optimization && (
              <Card className="p-4">
                <ScrollArea className="h-[300px]">
                  <div className="whitespace-pre-wrap text-sm">
                    {optimization}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
