import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
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

          {/* Navigation Links */}
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/download" className="btn-primary">
              Download
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
