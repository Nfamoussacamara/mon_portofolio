import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for now; integrate Sentry/monitoring here later
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
          <div className="max-w-xl text-center bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Oups — Une erreur est survenue</h2>
            <p className="text-sm text-slate-300 mb-4">L'application a rencontré une erreur inattendue. Vous pouvez tenter de recharger la page.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-blue-600 text-white">Recharger</button>
              <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 rounded border border-white/10">Fermer</button>
            </div>
            {this.state.error && (
              <pre className="text-xs text-slate-400 mt-4 text-left whitespace-pre-wrap break-words">{String(this.state.error.message)}</pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
