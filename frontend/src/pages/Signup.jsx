import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup({ username, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.error || err.message || 'সাইনআপ করতে সমস্যা হচ্ছে। সম্ভবত এই ইউজারনামটি আগেই ব্যবহৃত হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-green-900/20">
            <div className="glass-card w-full max-w-md p-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                        <UserPlus className="text-blue-400" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-100 mb-2">নতুন অ্যাকাউন্ট</h1>
                <p className="text-gray-400 text-center mb-8">সহজেই খরচ ট্র্যাক করতে রেজিস্ট্রেশন করুন</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 animate-in slide-in-from-top-2 duration-300">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! লগইন পেজে নিয়ে যাওয়া হচ্ছে...</span>
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
                                placeholder="একটি ইউজারনাম দিন"
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
                                placeholder="পাসওয়ার্ড দিন"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`w-full py-4 bg-blue-600/80 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 flex justify-center items-center gap-2 text-lg ${(loading || success) ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02]'
                            }`}
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'রেজিস্ট্রেশন করুন'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-400">
                    ইতিমধ্যেই অ্যাকাউন্ট আছে?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                        লগইন করুন
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
