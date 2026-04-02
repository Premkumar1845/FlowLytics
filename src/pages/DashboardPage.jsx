import useStore from '../store/useStore';
import SummaryCards from '../components/SummaryCards';
import BalanceTrendChart from '../components/BalanceTrendChart';
import SpendingBreakdownChart from '../components/SpendingBreakdownChart';
import RecentTransactions from '../components/RecentTransactions';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BalanceTrendChart />
                <SpendingBreakdownChart />
            </div>
            <RecentTransactions />
        </div>
    );
}
