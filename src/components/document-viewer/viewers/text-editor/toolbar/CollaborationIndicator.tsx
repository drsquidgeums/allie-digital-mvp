
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Wifi, WifiOff } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CollaboratorInfo {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  cursor?: {
    line: number;
    column: number;
  };
}

interface CollaborationIndicatorProps {
  editor: Editor;
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({ editor }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);

  // Simulate collaboration status (in a real app, this would connect to a real-time service)
  useEffect(() => {
    // Simulate connection status
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      
      // Simulate some collaborators
      setCollaborators([
        {
          id: '1',
          name: 'Alice Johnson',
          color: '#ff6b6b',
          isActive: true,
          cursor: { line: 5, column: 12 }
        },
        {
          id: '2',
          name: 'Bob Smith',
          color: '#4ecdc4',
          isActive: false
        }
      ]);
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const activeCollaborators = collaborators.filter(c => c.isActive);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1"
          aria-label="Collaboration status"
        >
          {isConnected ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <Users className="h-4 w-4" />
          {activeCollaborators.length > 0 && (
            <Badge variant="secondary" className="h-4 text-xs px-1">
              {activeCollaborators.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-sm">Collaboration</h3>
              <Badge 
                variant={isConnected ? "default" : "destructive"} 
                className="text-xs"
              >
                {isConnected ? "Connected" : "Offline"}
              </Badge>
            </div>
            
            {collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active collaborators
              </p>
            ) : (
              <div className="space-y-2">
                {collaborators.map(collaborator => (
                  <div 
                    key={collaborator.id} 
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent/50"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback 
                        className="text-xs"
                        style={{ backgroundColor: collaborator.color + '20', color: collaborator.color }}
                      >
                        {getInitials(collaborator.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {collaborator.name}
                      </div>
                      {collaborator.cursor && (
                        <div className="text-xs text-muted-foreground">
                          Line {collaborator.cursor.line}, Col {collaborator.cursor.column}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div 
                        className={`h-2 w-2 rounded-full ${
                          collaborator.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      {collaborator.isActive && (
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                disabled={!isConnected}
              >
                Share Document
              </Button>
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
