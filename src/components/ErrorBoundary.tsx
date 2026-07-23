import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    } catch (e) {
      console.warn('Failed to clear cache completely:', e);
    }
    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 300);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#020208] text-white flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-[#0d0922] border border-[#a78bfa]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(124,58,237,0.3)] text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-purple-400 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-2">
              Arohi AI Recovery Mode
            </h1>

            <p className="text-sm text-purple-200/80 mb-6 leading-relaxed">
              An unexpected display initialization issue occurred. You can restore session state instantly below.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-black/50 border border-purple-900/50 rounded-xl text-left text-xs font-mono text-purple-300 overflow-x-auto max-h-32">
                <p className="font-semibold text-rose-400 mb-1">{this.state.error.name}: {this.state.error.message}</p>
                {this.state.errorInfo?.componentStack && (
                  <p className="text-[10px] text-purple-400/70 whitespace-pre-wrap">{this.state.errorInfo.componentStack.slice(0, 300)}</p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full py-3 px-5 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Reset Local Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
