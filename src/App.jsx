import { useState, useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import AuthPage from './pages/AuthPage';

export default function App() {
    const darkMode = useStore((s) => s.darkMode);
    const activePage = useStore((s) => s.activePage);
    const isAuthenticated = useStore((s) => s.isAuthenticated);
    const verifyToken = useStore((s) => s.verifyToken);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Verify token on mount
    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const pages = {
        dashboard: <DashboardPage />,
        transactions: <TransactionsPage />,
        insights: <InsightsPage />,
    };

    // Show auth page if not logged in
    if (!isAuthenticated) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <AuthPage />
            </div>
        );
    }

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
                <div className="lg:ml-64">
                    <Header onMenuToggle={() => setMobileMenuOpen((o) => !o)} />
                    <main className="p-4 sm:p-6 max-w-7xl mx-auto">
                        {pages[activePage] || <DashboardPage />}
                    </main>
                </div>
            </div>
        </div>
    );
}
