
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { createOpenAICompletion, SYSTEM_PROMPT } from '@/utils/openai';
import { Loader2 } from 'lucide-react';

export const OpenAITest = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testOpenAI = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: input }
      ];
      
      console.log("Testing OpenAI with messages:", messages);
      const result = await createOpenAICompletion(messages);
      
      if (result) {
        setResponse(result);
        console.log("Test successful:", result);
      } else {
        setError('No response received from OpenAI');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error("Test failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">OpenAI Integration Test</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a message to test OpenAI..."
            onKeyDown={(e) => e.key === 'Enter' && !loading && testOpenAI()}
            disabled={loading}
          />
          <Button onClick={testOpenAI} disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {response && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <strong>OpenAI Response:</strong>
            <p className="mt-2 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
