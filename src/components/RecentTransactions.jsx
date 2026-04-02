import useStore from '../store/useStore';

export default function RecentTransactions() {
    const transactions = useStore((s) => s.transactions);
    const recent = transactions.slice(0, 5);

    if (recent.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Recent Transactions</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
                {recent.map((t) => (
                    <div
                        key={t.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${t.type === 'income'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                                    }`}
                            >
                                {t.type === 'income' ? '+' : '−'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{t.description}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{t.category} · {t.date}</p>
                            </div>
                        </div>
                        <span
                            className={`text-sm font-semibold flex-shrink-0 ml-3
                ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                        >
                            {t.type === 'income' ? '+' : '−'}${t.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
