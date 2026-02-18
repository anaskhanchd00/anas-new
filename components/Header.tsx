import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Home, 
  ChevronDown, 
  Phone, 
  User,
  Database,
  Search,
  Activity,
  LayoutDashboard,
  UserCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, adminUser, logout, logoutAdmin } = useAuth();

  // Public navigation
  const navLinks = [
    { label: 'Home', path: '/', icon: <Home size={18} className="mr-1" /> },
    { label: 'Insurance', path: '/#policies' },
    { label: 'Make a claim', path: '/contact' },
    { label: 'Help', path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2d1f2d] text-white shadow-xl border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2 group cursor-pointer"
              aria-label="SwiftPolicy Home"
            >
              <div className="bg-[#e91e8c] p-1 rounded-lg transition-all group-hover:scale-110 group-active:scale-95">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-outfit">
                SwiftPolicy
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center text-[15px] font-semibold transition-colors hover:text-[#ff4da6] whitespace-nowrap ${
                  isActive(link.path) ? 'text-white border-b-2 border-[#e91e8c] pb-1 mt-1' : 'text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link 
              to="/contact" 
              className="flex items-center gap-2 text-[15px] font-semibold hover:text-[#ff4da6] transition-colors pr-2"
            >
              <Phone size={18} />
              Contact
            </Link>
            
            {/* Dual session handling */}
            <div className="flex items-center gap-3">
              {/* Show Admin link independently */}
              {adminUser && (
                <div className="flex items-center gap-2 pr-4 border-r border-white/10 mr-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#e91e8c] hover:text-white transition-all"
                  >
                    <Settings size={14} /> Admin Console
                  </Link>
                  <button onClick={logoutAdmin} className="text-white/20 hover:text-white"><X size={14}/></button>
                </div>
              )}

              {/* Show User link or Login buttons */}
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/portal"
                    className="bg-[#e91e8c] hover:bg-[#c4167a] text-white px-6 py-2.5 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-pink-900/20 whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth?mode=signup"
                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-[15px] font-bold transition-all border border-white/10"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/auth"
                    className="bg-[#e91e8c] hover:bg-[#c4167a] text-white px-6 py-2.5 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-pink-900/20 whitespace-nowrap"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#2d1f2d] animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-white hover:text-[#e91e8c]"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-4">
              {adminUser && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-semibold text-[#e91e8c]"
                >
                  <Settings size={20} /> Admin Console
                </Link>
              )}
              
              {!user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/auth?mode=signup" 
                    onClick={() => setIsOpen(false)} 
                    className="bg-white/10 text-white px-4 py-4 rounded-xl text-center font-bold block"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/auth" 
                    onClick={() => setIsOpen(false)} 
                    className="bg-[#e91e8c] text-white px-4 py-4 rounded-xl text-center font-bold block shadow-lg"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    to="/portal" 
                    onClick={() => setIsOpen(false)} 
                    className="w-full bg-[#e91e8c] text-white px-4 py-4 rounded-xl text-center font-bold block shadow-lg"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="w-full text-center text-white/40 font-bold uppercase tracking-widest text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;