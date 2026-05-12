import { useState } from 'react';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { useAdmin } from '@/contexts/AdminContext';

function UserMenu() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn, logout } = useUser();
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Admin is logged in
  if (isAdminLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 glass-hover border border-cyan-500/30 rounded-lg hover:border-cyan-500/60 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-cyan-400">Admin</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-hover border border-cyan-500/30 rounded-lg overflow-hidden z-50">
              <button
                onClick={() => { setLocation('/admin/dashboard'); setDropdownOpen(false); }}
                className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={async () => { await logoutAdmin(); setDropdownOpen(false); setLocation('/'); }}
                className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular user is logged in
  if (isLoggedIn && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 glass-hover border border-cyan-500/30 rounded-lg hover:border-cyan-500/60 transition-all"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          )}
          <span className="text-sm font-semibold text-white max-w-[80px] truncate">
            {user.displayName?.split(' ')[0] || 'Player'}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 glass-hover border border-cyan-500/30 rounded-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-cyan-500/20">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm text-cyan-400 font-semibold truncate">
                {user.email || user.phoneNumber}
              </p>
            </div>
            <button
              onClick={async () => { await logout(); setDropdownOpen(false); }}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not logged in
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setLocation('/admin/login')}
        className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-cyan-400 transition-colors"
      >
        Admin
      </button>
      <button
        onClick={() => setLocation('/login')}
        className="btn-neon"
      >
        Login
      </button>
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { isLoggedIn, logout } = useUser();
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-hover border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setLocation('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold neon-cyan">GameTopUp</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#products" className="text-gray-300 hover:text-cyan-400 transition-colors">Products</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
          </nav>

          {/* User/Admin Menu */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-cyan-500/20 pt-4 flex flex-col gap-4">
            <a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#products" className="text-gray-300 hover:text-cyan-400 transition-colors">Products</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>

            {isAdminLoggedIn ? (
              <>
                <button
                  onClick={() => { setLocation('/admin/dashboard'); setIsOpen(false); }}
                  className="text-cyan-400 font-semibold text-left"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={async () => { await logoutAdmin(); setIsOpen(false); setLocation('/'); }}
                  className="text-red-400 text-left flex items-center gap-2"
                >
                  <LogOut size={16} /> Admin Sign Out
                </button>
              </>
            ) : isLoggedIn ? (
              <button
                onClick={async () => { await logout(); setIsOpen(false); }}
                className="text-red-400 text-left flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setLocation('/admin/login'); setIsOpen(false); }}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-left"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => { setLocation('/login'); setIsOpen(false); }}
                  className="btn-neon w-full"
                >
                  Login
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
