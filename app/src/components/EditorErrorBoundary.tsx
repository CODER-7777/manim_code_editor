"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackCode?: string;
  onFallbackCodeChange?: (code: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class EditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Monaco Editor failed to render:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col h-full bg-surface p-4">
          <div className="mb-3 p-3 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs text-text-secondary">
                Editor failed to load. You can continue editing in the fallback editor below.
              </span>
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:underline ml-2"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
          <textarea
            value={this.props.fallbackCode}
            onChange={(e) => this.props.onFallbackCodeChange?.(e.target.value)}
            className="flex-1 w-full p-4 rounded-lg bg-bg font-mono text-sm text-text border border-border resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Write your Manim Python code here..."
          />
        </div>
      );
    }

    return this.props.children;
  }
}
