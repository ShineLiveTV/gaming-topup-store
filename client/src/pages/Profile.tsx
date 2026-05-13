import { useState } from 'react';
import { ChevronRight, LogOut, Copy, Globe, Shield, Share2, Info, DollarSign, User, Lock, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, isLoggedIn, logout } = useUser();

  const [copied, setCopied] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const shortUserId = '@' + (user?.uid?.slice(0, 8).toUpperCase() || '');

  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(shortUserId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPw);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPw);
      setPwSuccess('Password ပြောင်းပြီးပြီ!');
      setCurrentPw('');
      setNewPw('');
      setTimeout(() => { setShowPwForm(false); setPwSuccess(''); }, 2000);
    } catch (err: any) {
      setPwError('Password မှားနေသည် သို့မဟုတ် ထပ်စမ်းပါ');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="relative bg-gradient-to-b from-cyan-900/40 to-background pb-8 pt-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10" />
        <button onClick={() => navigate('/')} className="relative z-10 mb-4 flex items-center gap-2 text-cyan-400 text-sm">
          <ArrowLeft size={18} /> ပင်မစာမျက်နှာ
        </button>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-400 overflow-hidden bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.displayName || 'Player'}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 pb-24 space-y-3 mt-2">

        {/* Account Info */}
        <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-cyan-500/10">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">အကောင့် အချက်အလက်</p>
          </div>
          <div className="px-4 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{user.displayName || 'Player'}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* User ID */}
        <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
          <button onClick={handleCopyId} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
            <div className="w-10 h-10 rounded-full bg-magenta-500/20 flex items-center justify-center">
              <Copy size={20} className="text-magenta-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">အသုံးပြုသူ ID</p>
              <p className="text-xs text-gray-400">ID ကို ကူးယူရန် နှိပ်ပါ</p>
            </div>
            <span className="text-sm font-mono text-cyan-400">
              {copied ? <span className="text-green-400 flex items-center gap-1"><Check size={14} /> Copied!</span> : shortUserId}
            </span>
          </button>
        </div>

        {/* Password Change */}
        <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
          <button onClick={() => setShowPwForm(!showPwForm)}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Lock size={20} className="text-yellow-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">စကားဝှက် ပြောင်းရန်</p>
              <p className="text-xs text-gray-400">သင့်လျို့ဝှက်ရှားကို အပ်ဒိတ်လုပ်ရန်</p>
            </div>
            <ChevronRight size={18} className={`text-gray-500 transition-transform ${showPwForm ? 'rotate-90' : ''}`} />
          </button>

          {showPwForm && (
            <form onSubmit={handleChangePassword} className="px-4 pb-4 space-y-3 border-t border-cyan-500/10 pt-3">
              {user.providerData[0]?.providerId === 'google.com' ? (
                <p className="text-yellow-400 text-sm">Google နဲ့ login ဝင်ထားတာမို့ password ပြောင်း၍မရပါ</p>
              ) : (
                <>
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} placeholder="လက်ရှိ Password" value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)} required
                      className="w-full pl-4 pr-10 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3 text-gray-400">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} placeholder="Password အသစ် (အနည်းဆုံး ၆ လုံး)" value={newPw}
                      onChange={e => setNewPw(e.target.value)} required minLength={6}
                      className="w-full pl-4 pr-10 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                  {pwSuccess && <p className="text-green-400 text-xs">{pwSuccess}</p>}
                  <button type="submit" disabled={pwLoading}
                    className="w-full btn-neon py-2 text-sm font-semibold disabled:opacity-50">
                    {pwLoading ? 'ပြောင်းနေသည်...' : 'Password ပြောင်းမည်'}
                  </button>
                </>
              )}
            </form>
          )}
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
            <span className="text-sm text-gray-400">🇲🇲 MMK</span>
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
            <span className="text-sm text-gray-400">မြန်မာ (Myanmar)</span>
          </button>
        </div>

        {/* Privacy */}
        <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Shield size={20} className="text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">ကိုယ်ရေးကိုယ်တာမူဝါဒ</p>
              <p className="text-xs text-gray-400">ကျွန်ုပ်တို့၏ မူဝါဒကို ကြည့်ရှုပါ</p>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Share */}
        <div className="glass-effect border border-cyan-500/20 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-cyan-500/5 transition-all">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Share2 size={20} className="text-orange-400" />
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
