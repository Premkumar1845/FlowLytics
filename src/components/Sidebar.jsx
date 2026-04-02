import { LayoutDashboard, ArrowLeftRight, Lightbulb, Sun, Moon, Shield, User, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedLogo from './AnimatedLogo';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onClose }) {
    const activePage = useStore((s) => s.activePage);
    const setActivePage = useStore((s) => s.setActivePage);
    const role = useStore((s) => s.role);
    const user = useStore((s) => s.user);
    const logout = useStore((s) => s.logout);
    const darkMode = useStore((s) => s.darkMode);
    const toggleDarkMode = useStore((s) => s.toggleDarkMode);

    return (
        <>
            {/* Overlay for mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2.5">
                        <AnimatedLogo size={36} />
                        <span className="tracking-tight">Flowlytics</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setActivePage(id); onClose(); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activePage === id
                                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Bottom controls */}
                <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    {/* User info */}
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            {role === 'admin' ? <Shield size={14} className="text-indigo-600 dark:text-indigo-400" /> : <User size={14} className="text-amber-600 dark:text-amber-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium
              bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>

                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium
              bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </aside>
        </>
    );
}
