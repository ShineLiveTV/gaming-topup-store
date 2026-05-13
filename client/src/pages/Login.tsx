import { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Mail, Lock, ChevronRight, LogOut, Copy, Globe, Shield, Share2, Info, DollarSign } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';

export default function Login() {
  const [, navigate] = useLocation();
  const { user, isLoggedIn, register, loginWithEmail, loginWithGoogle, logout, authError } = useUser();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const shortUserId = user?.uid?.slice(0, 8).toUpperCase() || '';

  const handleCopyId = () => {
    navigator.clipboard.writeText('@' + shortUserId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ===== PROFILE PAGE =====
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header BG */}
        <div className="relative bg-gradient-to-b from-cyan-900/40 to-background pb-6 pt-12 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-cyan-400 overflow-hidden bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/30">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{user.displayName || 'Player'}</h2>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-24 space-y-3 mt-4">

          {/* Profile */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button onClick={() => navigate('/')}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <User size={20} className="text-cyan-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">ပရိုဖိုင်</p>
                <p className="text-xs text-gray-400">သင့်ပရိုဖိုင်ကို အပ်ဒိတ်လုပ်ရန်</p>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Currency */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign size={20} className="text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">ငွေကြေး</p>
                <p className="text-xs text-gray-400">မူလငွေကြေး ပြောင်းလဲမည်</p>
              </div>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                🇲🇲 MMK
              </span>
            </button>
          </div>

          {/* User ID */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button onClick={handleCopyId}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-magenta-500/20 flex items-center justify-center">
                <Copy size={20} className="text-magenta-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">အသုံးပြုသူ ID</p>
                <p className="text-xs text-gray-400">အသုံးပြုသူ ID ကို ကူးယူပါ</p>
              </div>
              <span className="text-sm text-cyan-400 font-mono">
                {copied ? '✓ Copied!' : '@' + shortUserId}
              </span>
            </button>
          </div>

          {/* Language */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Globe size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">Language</p>
                <p className="text-xs text-gray-400">ဘာသာစကား ပြောင်းရန်</p>
              </div>
              <span className="text-sm text-gray-400">မြန်မာ</span>
            </button>
          </div>

          {/* Privacy */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Shield size={20} className="text-yellow-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">ကိုယ်ရေးကိုယ်တာမူဝါဒ</p>
                <p className="text-xs text-gray-400">ကျွန်ုပ်တို့၏ ကိုယ်ရေးကိုယ်တာမူဝါဒကို ကြည့်ရှုပါ</p>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Share */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Share2 size={20} className="text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">မျှဝေမည်</p>
                <p className="text-xs text-gray-400">သူငယ်ချင်းများနှင့် မျှဝေမည်</p>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* About */}
          <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Info size={20} className="text-cyan-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">အကြောင်း</p>
                <p className="text-xs text-gray-400">ကျွန်ုပ်တိုအကြောင်း</p>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Logout */}
          <div className="glass-effect border border-red-500/20 rounded-2xl overflow-hidden">
            <button onClick={async () => { await logout(); navigate('/'); }}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-500/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <LogOut size={20} className="text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-red-400">ထွက်ရန်</p>
                <p className="text-xs text-gray-400">အကောင့်မှ ထွက်ရန်</p>
              </div>
            </button>
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-cyan-500/20 px-6 py-3 flex justify-around">
          <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">ပင်မ</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">အော်ဒါ</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs">မှတ်တမ်း</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-cyan-400">
            <User className="w-6 h-6" />
            <span className="text-xs">ပရိုဖိုင်</span>
          </button>
        </div>
      </div>
    );
  }

  // ===== LOGIN/REGISTER PAGE =====
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(regName, regEmail, regPassword);
    if (ok) navigate('/');
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await loginWithEmail(loginEmail, loginPassword);
    if (ok) navigate('/');
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const ok = await loginWithGoogle();
    if (ok) navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-hover border-2 border-cyan-500/50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <span className="text-xl font-bold neon-cyan">GameTopUp</span>
            </div>
          </div>

          <div className="flex mb-6 border border-cyan-500/30 rounded-lg overflow-hidden">
            <button onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === 'login' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}>
              Login
            </button>
            <button onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === 'register' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}>
              Register
            </button>
          </div>

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="နာမည်" value={regName}
                  onChange={e => setRegName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Gmail" value={regEmail}
                  onChange={e => setRegEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (အနည်းဆုံး ၆ လုံး)" value={regPassword}
                  onChange={e => setRegPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">{authError}</p>}
              <button type="submit" disabled={loading}
                className="w-full btn-neon py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> လုပ်ဆောင်နေသည်...</> : 'အကောင့်ဖွင့်မည်'}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-cyan-500/20" />
                <span className="text-gray-500 text-xs">သို့မဟုတ်</span>
                <div className="flex-1 h-px bg-cyan-500/20" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading}
                className="w-full py-3 border border-cyan-500/30 rounded-lg text-white hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 font-semibold">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
                Google နဲ့ဝင်မည်
              </button>
            </form>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Gmail" value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">{authError}</p>}
              <button type="submit" disabled={loading}
                className="w-full btn-neon py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> ဝင်နေသည်...</> : 'Login ဝင်မည်'}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-cyan-500/20" />
                <span className="text-gray-500 text-xs">သို့မဟုတ်</span>
                <div className="flex-1 h-px bg-cyan-500/20" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading}
                className="w-full py-3 border border-cyan-500/30 rounded-lg text-white hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 font-semibold">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
                Google နဲ့ဝင်မည်
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-cyan-400 text-sm">← Back to Home</button>
          </div>
          <div className="mt-4 pt-4 border-t border-cyan-500/20 text-center">
            <button onClick={() => navigate('/admin/login')} className="text-xs text-gray-500 hover:text-cyan-400">Admin Login →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
