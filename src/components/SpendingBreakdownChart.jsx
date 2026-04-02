import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import useStore from '../store/useStore';
import { getCategoryData } from '../data/mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export default function SpendingBreakdownChart() {
    const transactions = useStore((s) => s.transactions);
    const darkMode = useStore((s) => s.darkMode);
    const data = useMemo(() => getCategoryData(transactions), [transactions]);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending Breakdown</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-12">No expense data</p>
            </div>
        );
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
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
                </PieChart>
            </ResponsiveContainer>
            {/* Legend list */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                {data.slice(0, 6).map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="truncate">{item.name}</span>
                        <span className="ml-auto font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
