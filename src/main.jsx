import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Clear any corrupted persisted state on first load
try {
    const stored = localStorage.getItem('flowlytics-storage');
    if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed?.state?.transactions || !Array.isArray(parsed.state.transactions)) {
            localStorage.removeItem('flowlytics-storage');
        }
    }
} catch {
    localStorage.removeItem('flowlytics-storage');
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
