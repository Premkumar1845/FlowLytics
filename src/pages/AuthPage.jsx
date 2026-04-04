import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Loader2 } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import useStore from '../store/useStore';

export default function AuthPage() {
    const login = useStore((s) => s.login);
    const register = useStore((s) => s.register);

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'viewer',
    });

    const updateField = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                if (!form.name.trim()) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }
                await register(form.name, form.email, form.password, form.role);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1145 30%, #302b63 60%, #24243e 100%)' }}>
            {/* Ambient glow orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo — large, centered, stacked */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <AnimatedLogo size={120} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Flowlytics
                    </h1>
                    <p className="text-slate-400 text-sm tracking-wide">
                        {isLogin ? 'Welcome back — sign in to continue' : 'Get started — create your account'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.1] p-8">
                    {/* Toggle Login / Sign Up */}
                    <div className="flex rounded-xl bg-white/[0.06] p-1 mb-7">
                        {['Login', 'Sign Up'].map((label, i) => {
                            const active = i === 0 ? isLogin : !isLogin;
                            return (
                                <button
                                    key={label}
                                    onClick={() => { setIsLogin(i === 0); setError(''); }}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${active
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name (sign up only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Role selection (sign up only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Select Role
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateField('role', 'admin')}
                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === 'admin'
                                            ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/10'
                                            : 'border-white/[0.1] text-slate-400 hover:border-white/[0.2] hover:text-slate-300'
                                            }`}
                                    >
                                        <Shield size={18} />
                                        Admin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('role', 'viewer')}
                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === 'viewer'
                                            ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                                            : 'border-white/[0.1] text-slate-400 hover:border-white/[0.2] hover:text-slate-300'
                                            }`}
                                    >
                                        <User size={18} />
                                        User
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-8">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}
