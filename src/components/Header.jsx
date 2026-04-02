import { Menu, Shield, Eye } from 'lucide-react';
import useStore from '../store/useStore';

export default function Header({ onMenuToggle }) {
    const role = useStore((s) => s.role);
    const activePage = useStore((s) => s.activePage);
    const user = useStore((s) => s.user);

    const titles = {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        insights: 'Insights',
    };

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        <Menu size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {titles[activePage] || 'Dashboard'}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              ${role === 'admin'
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                                : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                            }`}
                    >
                        {role === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
                        {role === 'admin' ? 'Admin' : 'Viewer'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}
