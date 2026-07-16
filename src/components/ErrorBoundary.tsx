import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught component rendering error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex items-center justify-center px-4 relative">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] -top-40 -left-40 pointer-events-none"></div>
          <div className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[120px] -bottom-40 -right-40 pointer-events-none"></div>

          <div className="max-w-md w-full text-center relative z-10 p-8 rounded-2xl border border-gray-800 bg-gray-950/60 backdrop-blur-md shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle className="h-8 w-8 animate-pulse" />
            </div>

            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-500/10 rounded-full border border-red-500/20 inline-block mb-4">
              Client Protection Node Active
            </span>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Application Interface Restored
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A UI rendering mismatch was intercepted. Our self-healing frontend boundary isolated the error to protect your active session from crashing.
            </p>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 mb-6 text-left font-mono text-xs text-gray-500 overflow-x-auto max-h-32">
              <div className="text-red-400/90 font-semibold mb-1">// CLIENT DIALECT REPORT</div>
              <div className="text-red-400">{this.state.error?.name || "Error"}: {this.state.error?.message || "Unknown rendering exception"}</div>
              <div className="text-gray-600 mt-1">Status: Component Self-Healed</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={this.handleReset}
                className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Reload UI
              </button>
              <a
                href="/"
                className="w-full px-5 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Home className="h-4 w-4" />
                Home Hub
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
