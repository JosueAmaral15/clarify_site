import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-tech-blue font-heading">
                Clarify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue transition-colors"
            >
              Features
            </Link>
            <Link
              to="/download"
              className="text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue transition-colors"
            >
              Download
            </Link>
            <Link
              to="/docs"
              className="text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue transition-colors"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/JosueAmaral15/clarify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Desktop Auth Buttons & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-tech-blue transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Login
                </Link>
                <Link to="/download" className="text-white bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Download
                </Link>
              </>
            )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                /* Close Icon */
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger Icon */
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <Link
              to="/features"
              className="block py-3 text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
              onClick={closeMobileMenu}
            >
              Features
            </Link>
            <Link
              to="/download"
              className="block py-3 text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
              onClick={closeMobileMenu}
            >
              Download
            </Link>
            <Link
              to="/docs"
              className="block py-3 text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
              onClick={closeMobileMenu}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/JosueAmaral15/clarify"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-gray-700 dark:text-gray-300 hover:text-tech-blue dark:hover:text-tech-blue hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
              onClick={closeMobileMenu}
            >
              GitHub
            </a>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 text-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/download"
                    className="block w-full text-center py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                    onClick={closeMobileMenu}
                  >
                    Download
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
