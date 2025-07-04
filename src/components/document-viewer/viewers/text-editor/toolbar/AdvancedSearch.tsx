
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Search, Replace, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  position: number;
  text: string;
  context: string;
}

interface AdvancedSearchProps {
  editor: Editor;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [showReplace, setShowReplace] = useState(false);

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    const content = editor.getText();
    const results: SearchResult[] = [];
    
    try {
      let pattern: RegExp;
      
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        pattern = new RegExp(searchTerm, flags);
      } else {
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundary = wholeWord ? '\\b' : '';
        const flags = caseSensitive ? 'g' : 'gi';
        pattern = new RegExp(`${wordBoundary}${escapedTerm}${wordBoundary}`, flags);
      }

      let match;
      while ((match = pattern.exec(content)) !== null) {
        const position = match.index;
        const matchText = match[0];
        
        // Get context (20 characters before and after)
        const contextStart = Math.max(0, position - 20);
        const contextEnd = Math.min(content.length, position + matchText.length + 20);
        const context = content.substring(contextStart, contextEnd);
        
        results.push({
          position,
          text: matchText,
          context: context.replace(matchText, `**${matchText}**`)
        });
        
        // Prevent infinite loop with zero-width matches
        if (match.index === pattern.lastIndex) {
          pattern.lastIndex++;
        }
      }
      
      setSearchResults(results);
      setCurrentResultIndex(results.length > 0 ? 0 : -1);
      
      if (results.length > 0) {
        highlightResult(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  };

  const highlightResult = (index: number) => {
    if (index < 0 || index >= searchResults.length) return;
    
    const result = searchResults[index];
    const content = editor.getText();
    
    // Find the actual position in the editor
    const textBefore = content.substring(0, result.position);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length;
    
    // Focus and select the text
    editor.commands.focus();
    // This is a simplified approach - in a real implementation,
    // you'd need to convert text positions to editor positions
  };

  const navigateResult = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentResultIndex < searchResults.length - 1 ? currentResultIndex + 1 : 0;
    } else {
      newIndex = currentResultIndex > 0 ? currentResultIndex - 1 : searchResults.length - 1;
    }
    
    setCurrentResultIndex(newIndex);
    highlightResult(newIndex);
  };

  const replaceCurrentResult = () => {
    if (currentResultIndex < 0 || currentResultIndex >= searchResults.length) return;
    
    const result = searchResults[currentResultIndex];
    const content = editor.getText();
    
    // Replace the text
    const newContent = content.substring(0, result.position) + 
                      replaceTerm + 
                      content.substring(result.position + result.text.length);
    
    editor.commands.setContent(`<p>${newContent.replace(/\n/g, '</p><p>')}</p>`);
    
    // Refresh search results
    performSearch();
  };

  const replaceAllResults = () => {
    if (searchResults.length === 0) return;
    
    let content = editor.getText();
    
    try {
      let pattern: RegExp;
      
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        pattern = new RegExp(searchTerm, flags);
      } else {
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundary = wholeWord ? '\\b' : '';
        const flags = caseSensitive ? 'g' : 'gi';
        pattern = new RegExp(`${wordBoundary}${escapedTerm}${wordBoundary}`, flags);
      }
      
      const newContent = content.replace(pattern, replaceTerm);
      editor.commands.setContent(`<p>${newContent.replace(/\n/g, '</p><p>')}</p>`);
      
      // Clear search results
      setSearchResults([]);
      setCurrentResultIndex(-1);
    } catch (error) {
      console.error('Replace error:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(performSearch, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [searchTerm, caseSensitive, useRegex, wholeWord]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Advanced search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Advanced Search</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplace(!showReplace)}
                className="h-6 text-xs"
              >
                <Replace className="h-3 w-3 mr-1" />
                Replace
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Search for..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
              
              {showReplace && (
                <Input
                  placeholder="Replace with..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="text-sm"
                />
              )}
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1">
                    <Switch
                      checked={caseSensitive}
                      onCheckedChange={setCaseSensitive}
                      className="scale-75"
                    />
                    Case sensitive
                  </label>
                  
                  <label className="flex items-center gap-1">
                    <Switch
                      checked={useRegex}
                      onCheckedChange={setUseRegex}
                      className="scale-75"
                    />
                    Regex
                  </label>
                  
                  <label className="flex items-center gap-1">
                    <Switch
                      checked={wholeWord}
                      onCheckedChange={setWholeWord}
                      className="scale-75"
                    />
                    Whole word
                  </label>
                </div>
                
                {searchResults.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {currentResultIndex + 1} of {searchResults.length}
                  </Badge>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateResult('prev')}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateResult('next')}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  {showReplace && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={replaceCurrentResult}
                        className="h-6 text-xs px-2"
                      >
                        Replace
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={replaceAllResults}
                        className="h-6 text-xs px-2"
                      >
                        Replace All
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <ScrollArea className="h-32">
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentResultIndex(index);
                        highlightResult(index);
                      }}
                      className={`w-full text-left p-2 text-xs rounded transition-colors ${
                        index === currentResultIndex 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="font-mono">{result.context}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
