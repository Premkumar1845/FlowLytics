import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, X, Download, ChevronUp, ChevronDown } from 'lucide-react';
import useStore, { getFilteredTransactions } from '../store/useStore';

const allCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Salary', 'Freelance', 'Investment', 'Other Income',
];

export default function TransactionsPage() {
    const role = useStore((s) => s.role);
    const transactions = useStore((s) => s.transactions);
    const filters = useStore((s) => s.filters);
    const setFilter = useStore((s) => s.setFilter);
    const resetFilters = useStore((s) => s.resetFilters);
    const addTransaction = useStore((s) => s.addTransaction);
    const updateTransaction = useStore((s) => s.updateTransaction);
    const deleteTransaction = useStore((s) => s.deleteTransaction);

    const filtered = useMemo(() => getFilteredTransactions(transactions, filters), [transactions, filters]);
    const [showFilters, setShowFilters] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ date: '', description: '', amount: '', category: 'Food & Dining', type: 'expense' });
    const [page, setPage] = useState(1);
    const perPage = 15;
    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const isAdmin = role === 'admin';

    const openAdd = () => {
        setEditId(null);
        setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: '', category: 'Food & Dining', type: 'expense' });
        setFormOpen(true);
    };

    const openEdit = (t) => {
        setEditId(t.id);
        setForm({ date: t.date, description: t.description, amount: String(t.amount), category: t.category, type: t.type });
        setFormOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...form, amount: parseFloat(form.amount) };
        if (isNaN(data.amount) || data.amount <= 0) return;
        if (!data.date || !data.description.trim()) return;

        if (editId) {
            updateTransaction(editId, data);
        } else {
            addTransaction(data);
        }
        setFormOpen(false);
    };

    const handleExport = () => {
        const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
        const rows = filtered.map((t) => [t.date, t.description, t.amount, t.category, t.type]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const toggleSort = (field) => {
        if (filters.sortBy === field) {
            setFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setFilter('sortBy', field);
            setFilter('sortOrder', 'desc');
        }
    };

    const SortIcon = ({ field }) => {
        if (filters.sortBy !== field) return null;
        return filters.sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => { setFilter('search', e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800
              text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
            ${showFilters
                            ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                >
                    <SlidersHorizontal size={15} /> Filters
                </button>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600
            text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <Download size={15} /> Export
                </button>
                {isAdmin && (
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700
              text-sm font-medium text-white transition-colors"
                    >
                        <Plus size={15} /> Add
                    </button>
                )}
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select
                        value={filters.type}
                        onChange={(e) => { setFilter('type', e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
              text-sm text-slate-700 dark:text-slate-200"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <select
                        value={filters.category}
                        onChange={(e) => { setFilter('category', e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
              text-sm text-slate-700 dark:text-slate-200"
                    >
                        <option value="all">All Categories</option>
                        {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => { setFilter('dateFrom', e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
              text-sm text-slate-700 dark:text-slate-200"
                        placeholder="From"
                    />
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => { setFilter('dateTo', e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
              text-sm text-slate-700 dark:text-slate-200"
                        placeholder="To"
                    />
                    <button
                        onClick={() => { resetFilters(); setPage(1); }}
                        className="sm:col-span-2 lg:col-span-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline text-center"
                    >
                        Reset all filters
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <th
                                    className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                                    onClick={() => toggleSort('date')}
                                >
                                    <span className="inline-flex items-center gap-1">Date <SortIcon field="date" /></span>
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Description</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Type</th>
                                <th
                                    className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                                    onClick={() => toggleSort('amount')}
                                >
                                    <span className="inline-flex items-center gap-1 justify-end">Amount <SortIcon field="amount" /></span>
                                </th>
                                {isAdmin && (
                                    <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-slate-400 dark:text-slate-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{t.date}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">{t.description}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium
                          ${t.type === 'income'
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                        : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                                                    }`}
                                            >
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap
                      ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {t.type === 'income' ? '+' : '−'}${t.amount.toLocaleString()}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEdit(t)}
                                                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTransaction(t.id)}
                                                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-md text-xs font-medium transition-colors
                    ${p === page
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                {editId ? 'Edit Transaction' : 'Add Transaction'}
                            </h3>
                            <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
                    text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                    maxLength={100}
                                    placeholder="e.g. Grocery shopping"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
                    text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        required
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
                      text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
                      text-sm text-slate-700 dark:text-slate-200"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
                    text-sm text-slate-700 dark:text-slate-200"
                                >
                                    {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                            >
                                {editId ? 'Save Changes' : 'Add Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
