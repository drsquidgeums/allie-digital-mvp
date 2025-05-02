
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { emitTaskNotification } from "@/utils/notifications";

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * A class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole application.
 * 
 * Based on React's Error Boundary pattern: https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * Static lifecycle method invoked after an error has been thrown by a descendant component
   * Returns the new state to be used for rendering the fallback UI
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method invoked after an error has been thrown by a descendant component
   * Used for side effects like logging the error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Notify the user about the error through the notification system
    emitTaskNotification(
      "Error Detected",
      "An unexpected error occurred. Please try refreshing the page."
    );
  }

  /**
   * Resets the error state, allowing the component to attempt to re-render its children
   */
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  public render() {
    // If there's an error, show either the custom fallback or the default error UI
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p className="text-sm mb-4">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.handleReset}
                  className="mr-2"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // If there's no error, render the children normally
    return this.props.children;
  }
}
