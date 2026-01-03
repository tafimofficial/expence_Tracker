import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense, getCategories } from '../api';
import { ChevronDown } from 'lucide-react';

const ExpenseForm = ({ onSuccess, expenseToEdit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: 'expense',
    });
    const [categories, setCategories] = useState([]);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (expenseToEdit) {
            setFormData({
                title: expenseToEdit.title,
                amount: expenseToEdit.amount,
                date: expenseToEdit.date,
                category: expenseToEdit.category,
                type: expenseToEdit.type,
            });
        }
    }, [expenseToEdit]);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (expenseToEdit) {
                await updateExpense(expenseToEdit.id, formData);
            } else {
                await createExpense(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving expense', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-2">
                {expenseToEdit ? 'হিসাব আপডেট করুন' : 'নতুন হিসাব যোগ করুন'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-300 mb-2 font-medium">বিবরণ</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        required
                        placeholder="কি বাবদ খরচ?"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2 font-medium">পরিমাণ (৳)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2 font-medium">তারিখ</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="block text-gray-300 mb-2 font-medium">ধরণ</label>
                    <button
                        type="button"
                        onClick={() => {
                            setIsTypeOpen(!isTypeOpen);
                            setIsCategoryOpen(false);
                        }}
                        className="input-field flex justify-between items-center w-full"
                    >
                        <span>{formData.type === 'expense' ? 'ব্যয় (Expense)' : 'আয় (Income)'}</span>
                        <ChevronDown size={18} className={`transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isTypeOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsTypeOpen(false)}
                            />
                            <div className="absolute top-full mt-2 left-0 w-full glass-card bg-[#1a1a1a] border border-gray-700 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: 'expense' });
                                        setIsTypeOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-t-lg transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-gray-300 hover:bg-gray-800'}`}
                                >
                                    ব্যয় (Expense)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: 'income' });
                                        setIsTypeOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-b-lg transition-colors ${formData.type === 'income' ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:bg-gray-800'}`}
                                >
                                    আয় (Income)
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="relative">
                    <label className="block text-gray-300 mb-2 font-medium">ক্যাটাগরি</label>
                    <button
                        type="button"
                        onClick={() => {
                            setIsCategoryOpen(!isCategoryOpen);
                            setIsTypeOpen(false);
                        }}
                        className="input-field flex justify-between items-center w-full"
                    >
                        <span>
                            {formData.category
                                ? categories.find(c => c.id == formData.category)?.name || 'নির্বাচন করুন'
                                : 'নির্বাচন করুন'}
                        </span>
                        <ChevronDown size={18} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCategoryOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsCategoryOpen(false)}
                            />
                            <div className="absolute top-full mt-2 left-0 w-full glass-card bg-[#1a1a1a] border border-gray-700 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, category: '' });
                                            setIsCategoryOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                                    >
                                        নির্বাচন করুন
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, category: cat.id });
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${formData.category == cat.id ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:bg-gray-800'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    type="submit"
                    className="btn-primary flex-1"
                >
                    {expenseToEdit ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
                {expenseToEdit && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                    >
                        বাতিল
                    </button>
                )}
            </div>
        </form>
    );
};


export default ExpenseForm;
