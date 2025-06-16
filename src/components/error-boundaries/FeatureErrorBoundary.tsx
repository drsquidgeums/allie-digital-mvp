
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * FeatureErrorBoundary Component
 * 
 * Provides graceful degradation for individual features.
 * When a feature fails, it shows a minimal error state without breaking the app.
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`${this.props.featureName} error:`, error, errorInfo);
    
    // Log to analytics or error reporting service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${this.props.featureName}: ${error.message}`,
        fatal: false
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default minimal error state
      return (
        <div className="flex items-center justify-center p-2 opacity-60">
          <Alert variant="default" className="max-w-xs border-dashed">
            <AlertTriangle className="h-3 w-3" />
            <AlertTitle className="text-xs">{this.props.featureName} Unavailable</AlertTitle>
            <AlertDescription>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={this.handleReset}
                className="text-xs h-6 mt-1 p-1"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
