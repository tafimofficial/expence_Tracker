import React, { useState } from 'react';
import { Trash2, Edit, Search, ChevronDown, Calendar } from 'lucide-react';

const ExpenseList = React.memo(({
    expenses,
    onDelete,
    onEdit,
    filterType,
    setFilterType,
    customDate,
    setCustomDate,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
}) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

    const groupedExpenses = React.useMemo(() => {
        const grouped = expenses.reduce((acc, expense) => {
            if (!acc[expense.date]) acc[expense.date] = [];
            acc[expense.date].push(expense);
            return acc;
        }, {});
        return Object.keys(grouped)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => ({ date, items: grouped[date] }));
    }, [expenses]);

    return (
        <div className="glass-card">
            <div className="p-4 border-b border-gray-700 bg-gray-900/40 relative z-30">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">লেনদেনের ইতিহাস</h3>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        {['day', 'week', 'month', 'all'].map(type => (
                            <button
                                key={type}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${filterType === type ? 'btn-primary shadow-lg ring-2 ring-green-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                onClick={() => setFilterType(type)}
                            >
                                {type === 'day' ? 'দিন' : type === 'week' ? 'সপ্তাহ' : type === 'month' ? 'মাস' : 'সব'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 relative group">
                            <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="নাম দিয়ে খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500"
                            />
                        </div>

                        <div className="md:col-span-4 relative z-50">
                            <button
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 py-2.5 px-4 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                            >
                                <span className={!selectedCategory ? 'text-gray-400' : ''}>
                                    {selectedCategory
                                        ? categories.find(c => c.id == selectedCategory)?.name || 'সব ক্যাটাগরি'
                                        : 'সব ক্যাটাগরি'}
                                </span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                                    <div className="absolute top-full mt-2 left-0 w-full glass-card bg-gray-900/95 backdrop-blur-2xl border border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                            <button
                                                onClick={() => { setSelectedCategory(''); setIsCategoryOpen(false); }}
                                                className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${!selectedCategory ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:bg-gray-800'}`}
                                            >
                                                সব ক্যাটাগরি
                                            </button>
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => { setSelectedCategory(cat.id); setIsCategoryOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${selectedCategory == cat.id ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:bg-gray-800'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="md:col-span-3">
                            {filterType === 'day' && (
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            {filterType === 'month' && (
                                <div className="relative z-40">
                                    <button
                                        onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                                        className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 py-2.5 px-4 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                    >
                                        <span>
                                            {new Date(customDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <Calendar size={18} className="text-gray-400" />
                                    </button>

                                    {isMonthPickerOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsMonthPickerOpen(false)} />
                                            <div className="absolute top-full mt-2 right-0 w-64 glass-card bg-gray-900/95 backdrop-blur-2xl border border-gray-700 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 rounded-xl">
                                                <div className="flex justify-between items-center mb-4">
                                                    <button
                                                        onClick={() => {
                                                            const d = new Date(customDate);
                                                            d.setFullYear(d.getFullYear() - 1);
                                                            setCustomDate(d.toISOString().split('T')[0]);
                                                        }}
                                                        className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <ChevronDown className="rotate-90" size={20} />
                                                    </button>
                                                    <span className="font-bold text-lg text-gray-200">
                                                        {new Date(customDate).getFullYear()}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const d = new Date(customDate);
                                                            d.setFullYear(d.getFullYear() + 1);
                                                            setCustomDate(d.toISOString().split('T')[0]);
                                                        }}
                                                        className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <ChevronDown className="-rotate-90" size={20} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {Array.from({ length: 12 }, (_, i) => {
                                                        const date = new Date(new Date(customDate).getFullYear(), i, 1);
                                                        const isSelected = date.getMonth() === new Date(customDate).getMonth();
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    setCustomDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`);
                                                                    setIsMonthPickerOpen(false);
                                                                }}
                                                                className={`py-2 text-sm rounded-lg transition-all ${isSelected
                                                                    ? 'bg-green-500/20 text-green-400 font-bold border border-green-500/30'
                                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                                                    }`}
                                                            >
                                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {(filterType === 'week' || filterType === 'all') && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800/20 border border-gray-700/30 rounded-lg text-gray-500 text-sm italic">
                                    {filterType === 'week' ? 'সাপ্তাহিক ভিউ' : 'সব সময়'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/60 text-gray-300 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-3">তারিখ</th>
                            <th className="px-6 py-3">বিবরণ</th>
                            <th className="px-6 py-3">ক্যাটাগরি</th>
                            <th className="px-6 py-3 text-right">পরিমাণ</th>
                            <th className="px-6 py-3 text-center">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {groupedExpenses.length > 0 ? (
                            groupedExpenses.map(({ date, items }) => (
                                <React.Fragment key={date}>
                                    <tr>
                                        <td colSpan="5" className="p-0 pt-4 pb-2">
                                            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900/50 border-l-4 border-green-500 rounded-r-lg mx-4">
                                                <div className="bg-green-500/20 p-1.5 rounded-lg text-green-400 font-bold">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="font-bold text-gray-200 text-base tracking-wide">
                                                    {new Date(date).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {items.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-gray-800/50 transition duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{expense.date}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-100">{expense.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-200">{expense.category_name}</span>
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold text-right ${expense.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                                {expense.type === 'income' ? '+' : '-'} ৳ {expense.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => onEdit(expense)} className="text-blue-400 hover:text-blue-300 p-1"><Edit size={18} /></button>
                                                    <button onClick={() => onDelete(expense.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">কোনো লেনদেন পাওয়া যায়নি।</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {groupedExpenses.length > 0 ? (
                    groupedExpenses.map(({ date, items }) => (
                        <div key={date} className="mb-6 relative">
                            <div className="sticky top-4 z-10 flex justify-center mb-4">
                                <div className="bg-gray-900/90 backdrop-blur-md px-5 py-2 rounded-full border border-green-500/30 shadow-lg flex items-center gap-2">
                                    <Calendar size={14} className="text-green-400" />
                                    <span className="text-sm font-bold text-gray-200">
                                        {new Date(date).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-700/50 space-y-3 px-2">
                                {items.map((expense) => (
                                    <div key={expense.id} className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 active:scale-[0.98] transition-transform">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-100 text-lg">{expense.title}</h4>
                                                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                    {expense.category_name}
                                                </span>
                                            </div>
                                            <span className={`font-bold text-lg ${expense.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                                {expense.type === 'income' ? '+' : '-'} ৳ {expense.amount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-gray-500">{expense.date}</span>
                                            <div className="flex gap-4">
                                                <button onClick={() => onEdit(expense)} className="flex items-center gap-1 text-blue-400 text-sm">
                                                    <Edit size={16} /> এডিট
                                                </button>
                                                <button onClick={() => onDelete(expense.id)} className="flex items-center gap-1 text-red-400 text-sm">
                                                    <Trash2 size={16} /> মুছুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400">কোনো লেনদেন পাওয়া যায়নি।</div>
                )}
            </div>
        </div>
    );
});

export default ExpenseList;
