import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { formatCurrency } from '../../lib/utils';

type HeaderProps = {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
};

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { siteName, siteLogoUrl } = useAppSettingsStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/' && !isAuthenticated;

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Products', path: '/products' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
  ];

  if (isHomePage) {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container-pad h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              {siteLogoUrl ? (
                <img src={siteLogoUrl} alt={siteName} className="w-6 h-6 object-contain" />
              ) : (
                <span className="text-[#2C204D] font-bold text-xl">
                  {siteName.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-gray-900 font-bold text-xl hidden sm:block">{siteName}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="text-gray-700 hover:text-[#2C204D] transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-[#2C204D] border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#2C204D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3A2B61] transition-colors"
              >
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg">
            <nav className="container-pad py-4 space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="block text-gray-800 hover:text-[#2C204D] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-800 hover:text-[#2C204D] transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-[#2C204D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3A2B61] transition-colors text-center"
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Regular header for other pages
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container-pad h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2C204D] rounded-lg flex items-center justify-center">
            {siteLogoUrl ? (
              <img src={siteLogoUrl} alt={siteName} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-white font-bold text-lg">{siteName.charAt(0)}</span>
            )}
          </div>
          <span className="text-xl font-bold text-[#2C204D]">{siteName}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600 dark:text-gray-400">Balance</div>
                <div className="font-medium">{formatCurrency(user?.walletBalance || 0)}</div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 dark:text-gray-300 hover:text-[#2C204D] font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#2C204D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3A2B61] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;