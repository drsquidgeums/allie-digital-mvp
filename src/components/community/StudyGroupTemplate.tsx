
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, BookOpen, Target, CheckCircle } from "lucide-react";

interface StudyGroupData {
  name: string;
  subject: string;
  accommodations: string[];
  communicationStyle: string;
  template: typeof STUDY_TEMPLATES[number] | undefined;
  isNeurodivergentFriendly: boolean;
  createdAt: Date;
}

interface StudyGroupTemplateProps {
  onCreateGroup: (groupData: StudyGroupData) => void;
}

const STUDY_TEMPLATES = [
  {
    id: "structured-session",
    name: "Structured Study Session",
    description: "Predictable format with clear time blocks",
    duration: "60 minutes",
    structure: [
      { time: "0-5 min", activity: "Welcome & Check-in", icon: Users },
      { time: "5-15 min", activity: "Review Previous Material", icon: BookOpen },
      { time: "15-40 min", activity: "New Content Focus", icon: Target },
      { time: "40-55 min", activity: "Practice & Questions", icon: CheckCircle },
      { time: "55-60 min", activity: "Summary & Next Steps", icon: Clock }
    ],
    tags: ["Structured", "Predictable", "Time-blocked"]
  },
  {
    id: "flexible-discussion",
    name: "Flexible Discussion Group",
    description: "Open format with optional participation",
    duration: "45 minutes",
    structure: [
      { time: "0-10 min", activity: "Optional Social Time", icon: Users },
      { time: "10-35 min", activity: "Topic Discussion", icon: BookOpen },
      { time: "35-45 min", activity: "Individual Reflection", icon: Target }
    ],
    tags: ["Flexible", "Discussion", "Optional"]
  },
  {
    id: "focused-work",
    name: "Focused Work Session",
    description: "Quiet co-working with minimal interaction",
    duration: "90 minutes",
    structure: [
      { time: "0-5 min", activity: "Goal Setting", icon: Target },
      { time: "5-80 min", activity: "Individual Work Time", icon: BookOpen },
      { time: "80-90 min", activity: "Progress Share (Optional)", icon: CheckCircle }
    ],
    tags: ["Quiet", "Individual", "Minimal Social"]
  }
];

export const StudyGroupTemplate = ({ onCreateGroup }: StudyGroupTemplateProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customization, setCustomization] = useState({
    name: "",
    subject: "",
    accommodations: [] as string[],
    communicationStyle: "text"
  });

  const ACCOMMODATION_OPTIONS = [
    "Extra processing time",
    "Written instructions provided",
    "Minimal background noise",
    "Structured conversation",
    "Break reminders",
    "Visual aids welcome",
    "No pressure to speak",
    "Recorded sessions available"
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = STUDY_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCustomization(prev => ({
        ...prev,
        name: `${template.name} - ${prev.subject || 'Study Group'}`
      }));
    }
  };

  const toggleAccommodation = (accommodation: string) => {
    setCustomization(prev => ({
      ...prev,
      accommodations: prev.accommodations.includes(accommodation)
        ? prev.accommodations.filter(a => a !== accommodation)
        : [...prev.accommodations, accommodation]
    }));
  };

  const handleCreateGroup = () => {
    if (!selectedTemplate || !customization.name || !customization.subject) {
      toast({
        title: "Missing Information",
        description: "Please select a template and fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    const template = STUDY_TEMPLATES.find(t => t.id === selectedTemplate);
    const groupData = {
      ...customization,
      template: template,
      isNeurodivergentFriendly: true,
      createdAt: new Date()
    };

    onCreateGroup(groupData);
    
    toast({
      title: "Study Group Created! 🎉",
      description: "Your neurodivergent-friendly study group has been set up with clear structure and accommodations."
    });

    // Reset form
    setSelectedTemplate(null);
    setCustomization({
      name: "",
      subject: "",
      accommodations: [],
      communicationStyle: "text"
    });
  };

  const selectedTemplateData = STUDY_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Create Structured Study Group</h3>
      
      {/* Template Selection */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Choose a Template Structure</h4>
        <div className="grid gap-3">
          {STUDY_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium">{template.name}</h5>
                <Badge variant="outline">{template.duration}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {selectedTemplate === template.id && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <h6 className="font-medium text-sm mb-2">Session Structure:</h6>
                  <div className="space-y-2">
                    {template.structure.map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <IconComponent className="h-3 w-3" />
                          <span className="font-mono text-xs bg-muted px-1 rounded">
                            {step.time}
                          </span>
                          <span>{step.activity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Customization Form */}
      {selectedTemplate && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium">Customize Your Group</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Group Name *</label>
              <Input
                value={customization.name}
                onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Subject *</label>
              <Input
                value={customization.subject}
                onChange={(e) => setCustomization(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Biology, Mathematics"
              />
            </div>
          </div>

          {/* Accommodations */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Learning Accommodations (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOMMODATION_OPTIONS.map((accommodation) => (
                <div 
                  key={accommodation}
                  className={`p-2 text-sm border rounded cursor-pointer transition-colors ${
                    customization.accommodations.includes(accommodation)
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:bg-muted/50'
                  }`}
                  onClick={() => toggleAccommodation(accommodation)}
                >
                  {accommodation}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button 
        onClick={handleCreateGroup}
        disabled={!selectedTemplate}
        className="w-full"
      >
        Create Structured Study Group
      </Button>
    </Card>
  );
};
