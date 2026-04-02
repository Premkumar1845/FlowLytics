import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

const API_URL = '/api/auth';

const useStore = create(
    persist(
        (set, get) => ({
            // Auth
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                let res;
                try {
                    res = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
                } catch {
                    throw new Error('Cannot connect to server. Make sure the backend is running.');
                }
                const text = await res.text();
                let data;
                try { data = JSON.parse(text); } catch { throw new Error('Server returned an invalid response'); }
                if (!res.ok) throw new Error(data.message || 'Login failed');
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    role: data.user.role,
                });
            },

            register: async (name, email, password, role) => {
                let res;
                try {
                    res = await fetch(`${API_URL}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password, role }),
                    });
                } catch {
                    throw new Error('Cannot connect to server. Make sure the backend is running.');
                }
                const text = await res.text();
                let data;
                try { data = JSON.parse(text); } catch { throw new Error('Server returned an invalid response'); }
                if (!res.ok) throw new Error(data.message || 'Registration failed');
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    role: data.user.role,
                });
            },

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    role: 'viewer',
                    activePage: 'dashboard',
                }),

            verifyToken: async () => {
                const { token } = get();
                if (!token) return;
                try {
                    const res = await fetch(`${API_URL}/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) throw new Error();
                    const data = await res.json();
                    set({ user: data.user, role: data.user.role, isAuthenticated: true });
                } catch {
                    set({ user: null, token: null, isAuthenticated: false, role: 'viewer' });
                }
            },

            // Role
            role: 'viewer',
            setRole: (role) => set({ role }),

            // Theme
            darkMode: false,
            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

            // Navigation
            activePage: 'dashboard',
            setActivePage: (activePage) => set({ activePage }),

            // Transactions
            transactions: mockTransactions,

            addTransaction: (transaction) =>
                set((s) => ({
                    transactions: [
                        { ...transaction, id: Math.max(0, ...s.transactions.map((t) => t.id)) + 1 },
                        ...s.transactions,
                    ],
                })),

            updateTransaction: (id, updates) =>
                set((s) => ({
                    transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),

            deleteTransaction: (id) =>
                set((s) => ({
                    transactions: s.transactions.filter((t) => t.id !== id),
                })),

            // Filters
            filters: {
                search: '',
                type: 'all',
                category: 'all',
                dateFrom: '',
                dateTo: '',
                sortBy: 'date',
                sortOrder: 'desc',
            },
            setFilter: (key, value) =>
                set((s) => ({ filters: { ...s.filters, [key]: value } })),
            resetFilters: () =>
                set({
                    filters: {
                        search: '',
                        type: 'all',
                        category: 'all',
                        dateFrom: '',
                        dateTo: '',
                        sortBy: 'date',
                        sortOrder: 'desc',
                    },
                }),
        }),
        {
            name: 'flowlytics-storage',
            partialize: (state) => ({
                transactions: state.transactions,
                darkMode: state.darkMode,
                role: state.role,
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            merge: (persistedState, currentState) => {
                if (!persistedState || !Array.isArray(persistedState.transactions)) {
                    return currentState;
                }
                return { ...currentState, ...persistedState };
            },
        }
    )
);

// Derived data helpers (use with useMemo in components)
export function getSummary(transactions) {
    const arr = transactions || [];
    const income = arr
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = arr
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    return {
        totalBalance: +(income - expenses).toFixed(2),
        totalIncome: +income.toFixed(2),
        totalExpenses: +expenses.toFixed(2),
        transactionCount: arr.length,
    };
}

export function getFilteredTransactions(transactions, filters) {
    let filtered = [...(transactions || [])];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
            (t) =>
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
        );
    }
    if (filters.type !== 'all') {
        filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters.category !== 'all') {
        filtered = filtered.filter((t) => t.category === filters.category);
    }
    if (filters.dateFrom) {
        filtered = filtered.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
        filtered = filtered.filter((t) => t.date <= filters.dateTo);
    }

    filtered.sort((a, b) => {
        let cmp = 0;
        if (filters.sortBy === 'date') cmp = a.date.localeCompare(b.date);
        else if (filters.sortBy === 'amount') cmp = a.amount - b.amount;
        else if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
        return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return filtered;
}

export default useStore;
