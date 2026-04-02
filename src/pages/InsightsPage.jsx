import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useStore from '../store/useStore';
import { getMonthlyData, getCategoryData } from '../data/mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export default function InsightsPage() {
    const transactions = useStore((s) => s.transactions);
    const darkMode = useStore((s) => s.darkMode);

    const insights = useMemo(() => {
        const expenses = transactions.filter((t) => t.type === 'expense');
        const incomes = transactions.filter((t) => t.type === 'income');

        // Highest spending category
        const catTotals = {};
        expenses.forEach((t) => {
            catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        });
        const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
        const highestCategory = sortedCats[0] || ['N/A', 0];
        const lowestCategory = sortedCats[sortedCats.length - 1] || ['N/A', 0];

        // Monthly comparison
        const months = {};
        transactions.forEach((t) => {
            const m = t.date.substring(0, 7);
            if (!months[m]) months[m] = { income: 0, expenses: 0 };
            if (t.type === 'income') months[m].income += t.amount;
            else months[m].expenses += t.amount;
        });
        const sortedMonths = Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
        const currentMonth = sortedMonths[0];
        const previousMonth = sortedMonths[1];
        let expenseChange = 0;
        let incomeChange = 0;
        if (currentMonth && previousMonth) {
            expenseChange = previousMonth[1].expenses
                ? ((currentMonth[1].expenses - previousMonth[1].expenses) / previousMonth[1].expenses) * 100
                : 0;
            incomeChange = previousMonth[1].income
                ? ((currentMonth[1].income - previousMonth[1].income) / previousMonth[1].income) * 100
                : 0;
        }

        // Average transaction
        const avgExpense = expenses.length ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;
        const avgIncome = incomes.length ? incomes.reduce((s, t) => s + t.amount, 0) / incomes.length : 0;

        // Largest single transactions
        const largestExpense = expenses.length ? expenses.reduce((max, t) => t.amount > max.amount ? t : max) : null;
        const largestIncome = incomes.length ? incomes.reduce((max, t) => t.amount > max.amount ? t : max) : null;

        // Savings rate
        const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
        const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        return {
            highestCategory, lowestCategory, expenseChange, incomeChange,
            avgExpense, avgIncome, largestExpense, largestIncome, savingsRate,
            currentMonthName: currentMonth ? new Date(currentMonth[0] + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
        };
    }, [transactions]);

    const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
    const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);
    const textColor = darkMode ? '#94a3b8' : '#64748b';

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertTriangle size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No data available</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add some transactions to see insights</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Insight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InsightCard
                    icon={<TrendingDown size={20} />}
                    iconColor="rose"
                    title="Highest Spending Category"
                    value={insights.highestCategory[0]}
                    detail={`$${insights.highestCategory[1].toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                />
                <InsightCard
                    icon={<DollarSign size={20} />}
                    iconColor="emerald"
                    title="Savings Rate"
                    value={`${insights.savingsRate.toFixed(1)}%`}
                    detail={insights.savingsRate >= 20 ? 'Healthy savings!' : 'Try to save more'}
                />
                <InsightCard
                    icon={<TrendingUp size={20} />}
                    iconColor="indigo"
                    title="Avg. Transaction"
                    value={`$${insights.avgExpense.toFixed(2)} expense`}
                    detail={`$${insights.avgIncome.toFixed(2)} avg income`}
                />
            </div>

            {/* Monthly comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                    Monthly Comparison — {insights.currentMonthName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${insights.expenseChange <= 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'}`}>
                            {insights.expenseChange <= 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Expenses vs Last Month</p>
                            <p className={`text-lg font-bold ${insights.expenseChange <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {insights.expenseChange >= 0 ? '+' : ''}{insights.expenseChange.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${insights.incomeChange >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'}`}>
                            {insights.incomeChange >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Income vs Last Month</p>
                            <p className={`text-lg font-bold ${insights.incomeChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {insights.incomeChange >= 0 ? '+' : ''}{insights.incomeChange.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bar chart */}
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category ranking */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Expense Categories Ranked</h3>
                    <div className="space-y-3">
                        {categoryData.map((cat, i) => {
                            const maxVal = categoryData[0]?.value || 1;
                            return (
                                <div key={cat.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{cat.name}</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            ${cat.value.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(cat.value / maxVal) * 100}%`,
                                                backgroundColor: COLORS[i % COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Notable transactions */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Notable Transactions</h3>
                    <div className="space-y-4">
                        {insights.largestExpense && (
                            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30">
                                <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mb-1">Largest Expense</p>
                                <p className="text-lg font-bold text-rose-700 dark:text-rose-300">
                                    ${insights.largestExpense.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-rose-600/70 dark:text-rose-400/70">
                                    {insights.largestExpense.description} · {insights.largestExpense.date}
                                </p>
                            </div>
                        )}
                        {insights.largestIncome && (
                            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                                <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400 mb-1">Largest Income</p>
                                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                    ${insights.largestIncome.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                                    {insights.largestIncome.description} · {insights.largestIncome.date}
                                </p>
                            </div>
                        )}
                        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mb-1">Lowest Spending Category</p>
                            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                {insights.lowestCategory[0]}
                            </p>
                            <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
                                ${insights.lowestCategory[1]?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ icon, iconColor, title, value, detail }) {
    const colorMap = {
        rose: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
        indigo: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[iconColor]}`}>
                {icon}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{detail}</p>
        </div>
    );
}
