import { useState } from 'react';
import { Mail, Phone, ArrowRight, Loader2, LogOut, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { ConfirmationResult } from 'firebase/auth';

/**
 * User Login Page - Firebase Authentication
 * Design: Cyberpunk Neon Minimalism
 * Supports:
 * - Phone number authentication (real Firebase OTP)
 * - Google OAuth authentication
 */

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn, loginWithGoogle, loginWithPhone, verifyOtp, logout } = useUser();

  const [step, setStep] = useState<'method' | 'phone' | 'otp'>('method');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Already logged in — show profile
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md">
          <div className="glass-hover border-2 border-cyan-500/50 p-8 text-center">
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center mb-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-2xl font-bold neon-cyan mb-1">
              {user.displayName || 'Player'}
            </h2>
            <p className="text-gray-400 text-sm mb-1">{user.email || user.phoneNumber}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
              User Account
            </span>

            <div className="space-y-3">
              <button
                onClick={() => setLocation('/')}
                className="w-full btn-neon py-3 font-semibold"
              >
                ← Back to Home
              </button>
              <button
                onClick={async () => { await logout(); setLocation('/'); }}
                className="w-full glass-hover border border-red-500/30 text-red-400 hover:border-red-500/60 py-3 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    setError('');

    try {
      const success = await verifyOtp(confirmationResult, otp);
      if (success) {
        setLocation('/');
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const success = await loginWithGoogle();
      if (success) {
        setLocation('/');
      } else {
        setError('Google login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-hover border-2 border-cyan-500/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <span className="text-2xl font-bold neon-cyan">GameTopUp</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 neon-cyan">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              {/* Phone Button */}
              <button
                onClick={() => setStep('phone')}
                className="w-full glass-hover border border-cyan-500/30 p-4 flex items-center gap-3 hover:border-cyan-500/60 transition-all"
              >
                <Phone size={24} className="text-cyan-400" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-white">Phone Number</p>
                  <p className="text-sm text-gray-400">Sign in with OTP</p>
                </div>
                <ArrowRight size={20} className="text-cyan-400" />
              </button>

              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full glass-hover border border-magenta-500/30 p-4 flex items-center gap-3 hover:border-magenta-500/60 transition-all disabled:opacity-50"
              >
                <Mail size={24} className="text-magenta-400" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-white">Google Account</p>
                  <p className="text-sm text-gray-400">Sign in with Google</p>
                </div>
                {loading ? (
                  <Loader2 size={20} className="text-magenta-400 animate-spin" />
                ) : (
                  <ArrowRight size={20} className="text-magenta-400" />
                )}
              </button>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={() => setLocation('/')}
                className="w-full mt-6 text-gray-400 hover:text-cyan-400 transition-colors py-2"
              >
                ← Back to Home
              </button>
            </div>
          )}

          {/* Phone Number Input */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+95 9 123 456 789"
                  className="w-full glass-hover border border-cyan-500/30 p-3 text-white placeholder-gray-500 focus:border-cyan-500/60 focus:outline-none transition-all"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Include country code e.g. +95 for Myanmar
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !phoneNumber}
                className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Sending OTP...</>
                ) : (
                  <><ArrowRight size={20} /> Send OTP</>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep('method'); setError(''); setPhoneNumber(''); }}
                className="w-full text-gray-400 hover:text-cyan-400 transition-colors py-2"
              >
                ← Back
              </button>
            </form>
          )}

          {/* OTP Input */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <p className="text-sm text-gray-400 mb-4">
                  6-digit code sent to <span className="text-cyan-400">{phoneNumber}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full glass-hover border border-cyan-500/30 p-3 text-white placeholder-gray-500 focus:border-cyan-500/60 focus:outline-none transition-all text-center text-2xl tracking-widest"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Verifying...</>
                ) : (
                  <>Verify & Sign In <ArrowRight size={20} /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setError(''); setOtp(''); }}
                className="w-full text-gray-400 hover:text-cyan-400 transition-colors py-2"
              >
                ← Back
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-cyan-500/20 text-center text-sm text-gray-400">
            <p>
              Admin?{' '}
              <button
                onClick={() => setLocation('/admin/login')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
              >
                Admin Login →
              </button>
            </p>
          </div>
        </div>

        {/* reCAPTCHA Container */}
        <div id="recaptcha-container" className="mt-4" />
      </div>
    </div>
  );
}
