import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    handleReset = () => {
        localStorage.removeItem('flowlytics-storage');
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                    <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
                        <p className="text-sm text-slate-500 mb-4">
                            The app encountered an error. This may be caused by corrupted cached data.
                        </p>
                        {this.state.error && (
                            <pre className="text-xs text-left bg-slate-100 text-rose-600 p-3 rounded-lg mb-4 overflow-auto max-h-40">
                                {this.state.error.message}
                                {'\n'}
                                {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
                            </pre>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            Reset & Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
