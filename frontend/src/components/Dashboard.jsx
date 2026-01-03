import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = React.memo(({ expenses, periodLabel }) => {
    const stats = useMemo(() => {
        let income = 0;
        let expense = 0;

        expenses.forEach((item) => {
            const amount = parseFloat(item.amount);
            if (item.type === 'income') {
                income += amount;
            } else {
                expense += amount;
            }
        });

        return {
            income,
            expense,
            balance: income - expense,
        };
    }, [expenses]);

    return (
        <div>
            {periodLabel && (
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-200">{periodLabel}</h2>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 flex items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity animate-float">
                        <TrendingUp size={64} className="text-green-500" />
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-full text-green-400 mr-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">মোট আয়</p>
                        <p className="text-2xl font-bold text-green-400">৳ {stats.income.toFixed(2)}</p>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity animate-float" style={{ animationDelay: '1s' }}>
                        <TrendingDown size={64} className="text-red-500" />
                    </div>
                    <div className="bg-red-500/20 p-3 rounded-full text-red-500 mr-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <TrendingDown size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">মোট ব্যয়</p>
                        <p className="text-2xl font-bold text-red-400">৳ {stats.expense.toFixed(2)}</p>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity animate-float" style={{ animationDelay: '2s' }}>
                        <Wallet size={64} className="text-blue-500" />
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-full text-blue-400 mr-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">বর্তমান ব্যালেন্স</p>
                        <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                            ৳ {stats.balance.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Dashboard;
