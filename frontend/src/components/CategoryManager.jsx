import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { Trash2, Edit, X, Plus, Save } from 'lucide-react';

const CategoryManager = ({ onClose, onUpdate }) => {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('নাম লিখুন');
            return;
        }

        try {
            if (editingId) {
                await updateCategory(editingId, { name });
            } else {
                await createCategory({ name });
            }
            setName('');
            setEditingId(null);
            fetchCategories();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Error saving category", err);
            setError('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setEditingId(category.id);
    };

    const handleDelete = async (id) => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?')) {
            try {
                await deleteCategory(id);
                fetchCategories();
                if (onUpdate) onUpdate();
            } catch (err) {
                console.error("Error deleting category", err);
            }
        }
    };

    const handleCancelEdit = () => {
        setName('');
        setEditingId(null);
        setError('');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-100 mb-6">ক্যাটাগরি ম্যানেজমেন্ট</h2>

                {/* Add/Edit Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ক্যাটাগরির নাম লিখুন..."
                            className="input-field flex-1"
                        />
                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center px-4"
                        >
                            {editingId ? <Save size={20} /> : <Plus size={20} />}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-secondary px-4 flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </form>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 group hover:border-green-500/30 transition-all">
                            <div className="flex flex-col">
                                <span className="text-gray-200 font-medium">{cat.name}</span>
                                {cat.user && <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">আপনার তৈরি</span>}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {cat.user ? (
                                    <>
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors"
                                            title="সম্পাদন করুন"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                                            title="মুছে ফেলুন"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-gray-500 mr-2">ডিফল্ট</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className="text-center text-gray-500 py-4">কোনো ক্যাটাগরি নেই</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
