import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpDown } from 'lucide-react';
import useStore, { getSummary } from '../store/useStore';

const cards = [
    { key: 'totalBalance', label: 'Total Balance', icon: Wallet, color: 'indigo', format: true },
    { key: 'totalIncome', label: 'Total Income', icon: TrendingUp, color: 'emerald', format: true },
    { key: 'totalExpenses', label: 'Total Expenses', icon: TrendingDown, color: 'rose', format: true },
    { key: 'transactionCount', label: 'Transactions', icon: ArrowUpDown, color: 'amber', format: false },
];

const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
    amber: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
};

export default function SummaryCards() {
    const transactions = useStore((s) => s.transactions);
    const summary = useMemo(() => getSummary(transactions), [transactions]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map(({ key, label, icon: Icon, color, format }) => (
                <div
                    key={key}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                            <Icon size={18} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {format ? `$${summary[key].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : summary[key]}
                    </p>
                </div>
            ))}
        </div>
    );
}
