const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Salary',
    'Freelance',
    'Investment',
    'Other Income',
];

const expenseCategories = categories.slice(0, 8);
const incomeCategories = categories.slice(8);

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransactions() {
    const transactions = [];
    const now = new Date(2026, 3, 1);
    const sixMonthsAgo = new Date(2025, 9, 1);

    for (let i = 1; i <= 120; i++) {
        const isIncome = Math.random() < 0.3;
        const date = randomDate(sixMonthsAgo, now);
        const category = isIncome
            ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
            : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

        let amount;
        if (isIncome) {
            amount = category === 'Salary'
                ? +(3000 + Math.random() * 5000).toFixed(2)
                : +(100 + Math.random() * 2000).toFixed(2);
        } else {
            amount = +(5 + Math.random() * 500).toFixed(2);
        }

        transactions.push({
            id: i,
            date: date.toISOString().split('T')[0],
            description: generateDescription(category, isIncome),
            amount,
            category,
            type: isIncome ? 'income' : 'expense',
        });
    }

    return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

function generateDescription(category, isIncome) {
    const descriptions = {
        'Food & Dining': ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Lunch Break'],
        'Transportation': ['Gas Station', 'Uber Ride', 'Bus Pass', 'Parking Fee', 'Car Maintenance'],
        'Shopping': ['Online Purchase', 'Clothing Store', 'Electronics', 'Home Goods', 'Book Store'],
        'Entertainment': ['Movie Tickets', 'Streaming Service', 'Concert Tickets', 'Game Purchase', 'Sports Event'],
        'Bills & Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance'],
        'Healthcare': ['Pharmacy', 'Doctor Visit', 'Dental Checkup', 'Gym Membership', 'Vitamins'],
        'Education': ['Online Course', 'Textbooks', 'Workshop Fee', 'Certification', 'Tutoring'],
        'Travel': ['Hotel Booking', 'Flight Ticket', 'Car Rental', 'Travel Insurance', 'Souvenirs'],
        'Salary': ['Monthly Salary', 'Salary Payment', 'Payroll Deposit'],
        'Freelance': ['Client Payment', 'Project Fee', 'Consulting Fee', 'Contract Work'],
        'Investment': ['Dividend Income', 'Stock Sale', 'Interest Payment', 'Rental Income'],
        'Other Income': ['Refund', 'Gift Received', 'Bonus', 'Cash Back', 'Side Hustle'],
    };
    const list = descriptions[category] || ['Transaction'];
    return list[Math.floor(Math.random() * list.length)];
}

export const mockTransactions = generateTransactions();

export const getMonthlyData = (transactions) => {
    const monthly = {};
    transactions.forEach((t) => {
        const month = t.date.substring(0, 7);
        if (!monthly[month]) monthly[month] = { month, income: 0, expenses: 0 };
        if (t.type === 'income') monthly[month].income += t.amount;
        else monthly[month].expenses += t.amount;
    });
    return Object.values(monthly)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((m) => ({
            ...m,
            income: +m.income.toFixed(2),
            expenses: +m.expenses.toFixed(2),
            balance: +(m.income - m.expenses).toFixed(2),
            name: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        }));
};

export const getCategoryData = (transactions) => {
    const cats = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            cats[t.category] = (cats[t.category] || 0) + t.amount;
        });
    return Object.entries(cats)
        .map(([name, value]) => ({ name, value: +value.toFixed(2) }))
        .sort((a, b) => b.value - a.value);
};
