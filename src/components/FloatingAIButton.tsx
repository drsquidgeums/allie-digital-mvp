import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIStatus } from '@/components/AIStatus';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AINotificationBadge } from './AINotificationBadge';
import { useLocalAIPersonalization } from '@/hooks/useLocalAIPersonalization';

export const FloatingAIButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { personalization } = useLocalAIPersonalization();
  
  const newRecommendationsCount = personalization.recommendations.length;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={toggleSidebar}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
          <AINotificationBadge 
            count={newRecommendationsCount} 
            className="absolute -top-1 -right-1 z-10"
          />
        </div>
      </div>

      {/* Sliding AI Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-background border-l border-border shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Status */}
            <div>
              <AIStatus />
            </div>

            {/* AI Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Smart Recommendations</h3>
              <AIRecommendations />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};