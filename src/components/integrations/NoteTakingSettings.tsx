
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNoteTakingIntegration } from "@/hooks/integrations/useNoteTakingIntegration";

export const NoteTakingSettings = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const { exportToNotion, exportToObsidian, connectApp } = useNoteTakingIntegration();

  const handleExport = (app: 'notion' | 'obsidian') => {
    if (noteTitle && noteContent) {
      const note = {
        title: noteTitle,
        content: noteContent,
        tags: noteTags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      if (app === 'notion') {
        exportToNotion(note);
      } else {
        exportToObsidian(note);
      }
      
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Note-Taking Integration</CardTitle>
        <CardDescription>Connect with your favorite note-taking apps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => connectApp('notion')}>
            Connect Notion
          </Button>
          <Button variant="outline" onClick={() => connectApp('obsidian')}>
            Connect Obsidian
          </Button>
          <Button variant="outline" onClick={() => connectApp('roam')}>
            Connect Roam
          </Button>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <Label>Export Note</Label>
          <Input
            placeholder="Note title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <Textarea
            placeholder="Note content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={4}
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={noteTags}
            onChange={(e) => setNoteTags(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleExport('notion')}>
              Export to Notion
            </Button>
            <Button variant="outline" onClick={() => handleExport('obsidian')}>
              Export to Obsidian
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
