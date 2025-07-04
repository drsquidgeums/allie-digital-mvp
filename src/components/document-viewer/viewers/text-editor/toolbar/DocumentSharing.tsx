
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Link, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';

interface DocumentSharingProps {
  editor: Editor;
  documentTitle: string;
}

export const DocumentSharing: React.FC<DocumentSharingProps> = ({ 
  editor, 
  documentTitle 
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    allowEditing: false,
    requirePassword: false,
    expiresIn: '7days',
    password: ''
  });
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const generateShareLink = () => {
    // Generate a mock share link - in a real app, this would be an API call
    const linkId = Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/shared/${linkId}`;
    setShareLink(link);
    
    toast({
      title: "Share Link Generated",
      description: "Your document is now ready to share",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Share link has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const exportAsHtml = () => {
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Exported",
      description: "HTML file has been downloaded",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            aria-label="Share Document"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Link className="h-4 w-4 mr-2" />
            Generate Share Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportAsHtml}>
            <Copy className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Create a shareable link for "{documentTitle}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-editing">Allow editing</Label>
              <Switch
                id="allow-editing"
                checked={shareSettings.allowEditing}
                onCheckedChange={(checked) =>
                  setShareSettings(prev => ({ ...prev, allowEditing: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="require-password">Require password</Label>
              <Switch
                id="require-password"
                checked={shareSettings.requirePassword}
                onCheckedChange={(checked) =>
                  setShareSettings(prev => ({ ...prev, requirePassword: checked }))
                }
              />
            </div>
            
            {shareSettings.requirePassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={shareSettings.password}
                  onChange={(e) =>
                    setShareSettings(prev => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter password"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="expires">Link expires in</Label>
              <select
                id="expires"
                value={shareSettings.expiresIn}
                onChange={(e) =>
                  setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="1day">1 day</option>
                <option value="7days">7 days</option>
                <option value="30days">30 days</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            {!shareLink ? (
              <Button onClick={generateShareLink} className="w-full">
                Generate Share Link
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={() => copyToClipboard(shareLink)}
                    size="icon"
                    variant="outline"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can {shareSettings.allowEditing ? 'edit' : 'view'} the document
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
