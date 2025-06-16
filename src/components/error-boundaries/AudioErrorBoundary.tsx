
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * AudioErrorBoundary Component
 * 
 * Specialized error boundary for audio-related components.
 * Provides graceful degradation when audio features fail.
 */
export class AudioErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Audio component error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  private handleDisableAudio = () => {
    // Dispatch event to disable audio globally
    window.dispatchEvent(new CustomEvent('disableAudio', { 
      detail: { reason: 'error_boundary' }
    }));
    this.handleReset();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-2">
          <Alert variant="default" className="max-w-xs">
            <VolumeX className="h-4 w-4" />
            <AlertTitle className="text-sm">Audio Unavailable</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p className="text-xs mb-3">
                  Background music is temporarily unavailable. All other features work normally.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={this.handleReset}
                    className="text-xs h-7"
                  >
                    Retry
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={this.handleDisableAudio}
                    className="text-xs h-7"
                  >
                    Disable Audio
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
