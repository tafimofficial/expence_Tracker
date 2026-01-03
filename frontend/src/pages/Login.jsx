import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'লগইন করতে সমস্যা হচ্ছে। সঠিক তথ্য দিন।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-green-900/20">
            <div className="glass-card w-full max-w-md p-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-500/20 rounded-2xl border border-green-500/30">
                        <LogIn className="text-green-400" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-100 mb-2">লগইন করুন</h1>
                <p className="text-gray-400 text-center mb-8">আপনার সাবধানে সংরক্ষিত তথ্য দেখতে লগইন করুন</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">ইউজারনাম</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-12"
                                placeholder="আপনার ইউজারনাম"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">পাসওয়ার্ড</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 btn-primary transition-all duration-300 flex justify-center items-center gap-2 text-lg ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02]'
                            }`}
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'লগইন'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-400">
                    অ্যাকাউন্ট নেই?{' '}
                    <Link to="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                        নতুন অ্যাকাউন্ট তৈরি করুন
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
