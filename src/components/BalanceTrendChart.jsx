import { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useStore from '../store/useStore';
import { getMonthlyData } from '../data/mockData';

export default function BalanceTrendChart() {
    const transactions = useStore((s) => s.transactions);
    const darkMode = useStore((s) => s.darkMode);
    const data = useMemo(() => getMonthlyData(transactions), [transactions]);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Balance Trend</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-12">No data to display</p>
            </div>
        );
    }

    const textColor = darkMode ? '#94a3b8' : '#64748b';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: textColor }} />
                    <YAxis tick={{ fontSize: 12, fill: textColor }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: darkMode ? '#1e293b' : '#fff',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: darkMode ? '#e2e8f0' : '#1e293b',
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
