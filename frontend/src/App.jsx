import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getExpenses, deleteExpense, getCategories } from './api';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlusCircle, Settings, LogOut, User } from 'lucide-react';

function ExpenseTrackerApp() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterType, setFilterType] = useState('month');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [filterType, customDate, searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }

  const fetchExpenses = async () => {
    try {
      const params = {};
      const date = new Date(customDate);

      if (filterType === 'day') {
        params.start_date = customDate;
        params.end_date = customDate;
      } else if (filterType === 'week') {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        params.start_date = firstDay.toISOString().split('T')[0];
        params.end_date = lastDay.toISOString().split('T')[0];
      } else if (filterType === 'month') {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        params.start_date = firstDay.toISOString().split('T')[0];
        params.end_date = lastDay.toISOString().split('T')[0];
      }

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await getExpenses(params);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense', error);
      }
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const getPeriodLabel = () => {
    if (filterType === 'all') return 'সর্বমোট হিসাব';
    if (filterType === 'day') {
      return new Date(customDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (filterType === 'week') return 'এই সপ্তাহের হিসাব';
    if (filterType === 'month') {
      return new Date(customDate).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' });
    }
    return 'হিসাব';
  };

  return (
    <div className="min-h-screen text-gray-100 pb-12">
      <nav className="glass border-b-0 rounded-none sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              খরচ ট্র্যাকার
            </h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
              <User size={14} className="text-green-400" />
              <span className="text-xs font-medium text-gray-300">{user?.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="p-2.5 sm:px-4 sm:py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-2xl transition-all flex items-center gap-2 group"
              title="ক্যাটাগরি ম্যানেজ করুন"
            >
              <Settings size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="hidden md:inline font-medium">ক্যাটাগরি</span>
            </button>

            <button
              onClick={() => {
                setEditingExpense(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 btn-primary px-4 py-2"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">{showForm ? 'বন্ধ করুন' : 'নতুন যোগ করুন'}</span>
              <span className="sm:hidden">{showForm ? 'বন্ধ' : 'যোগ'}</span>
            </button>

            <button
              onClick={logout}
              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 transition-all flex items-center gap-2 group"
              title="লগ আউট"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-medium">লগ আউট</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Dashboard expenses={expenses} periodLabel={getPeriodLabel()} />

        {showForm && (
          <ExpenseForm
            onSuccess={handleSuccess}
            expenseToEdit={editingExpense}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}

        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
          filterType={filterType}
          setFilterType={setFilterType}
          customDate={customDate}
          setCustomDate={setCustomDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {showCategoryManager && (
          <CategoryManager
            onClose={() => setShowCategoryManager(false)}
            onUpdate={() => {
              fetchCategories();
            }}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExpenseTrackerApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
