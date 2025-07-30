import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  Lightbulb, 
  Settings, 
  AlertTriangle, 
  TrendingUp,
  X,
  Check,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMicroInteractions } from '@/hooks/useMicroInteractions';

export type RecommendationType = 'action' | 'setting' | 'insight' | 'warning';

export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onDismiss: (id: string) => void;
  onSave: (id: string) => void;
  onApply?: (id: string) => void;
  compact?: boolean;
}

const typeConfig = {
  action: {
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badge: 'Quick Action'
  },
  setting: {
    icon: Settings,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badge: 'Setting'
  },
  insight: {
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badge: 'Insight'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badge: 'Warning'
  }
};

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onDismiss,
  onSave,
  onApply,
  compact = false
}) => {
  const { triggerInteraction, getStateClasses } = useMicroInteractions();
  const config = typeConfig[recommendation.type];
  const IconComponent = config.icon;

  const handleApply = () => {
    if (recommendation.action && onApply) {
      triggerInteraction(async () => {
        recommendation.action?.();
        onApply(recommendation.id);
      });
    }
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all duration-200 hover:shadow-sm",
        config.bgColor,
        config.borderColor,
        getStateClasses()
      )}>
        <IconComponent className={cn("w-4 h-4 shrink-0", config.color)} />
        <span className="flex-1 text-muted-foreground">{recommendation.title}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(recommendation.id)}
            className="h-6 w-6 p-0"
          >
            <Star className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(recommendation.id)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md animate-fade-in",
      config.borderColor,
      getStateClasses()
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-full", config.bgColor)}>
              <IconComponent className={cn("w-4 h-4", config.color)} />
            </div>
            <div>
              <Badge variant="secondary" className="text-xs">
                {config.badge}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(recommendation.id)}
              className="h-8 w-8 p-0 hover:bg-yellow-100"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(recommendation.id)}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">{recommendation.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {recommendation.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <div className="w-16 h-2 bg-muted rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${recommendation.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium">{recommendation.confidence}%</span>
            </div>
          </div>

          {recommendation.actionable && recommendation.action && (
            <Button
              size="sm"
              onClick={handleApply}
              className="w-full mt-3 text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              {recommendation.actionLabel || 'Apply'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};