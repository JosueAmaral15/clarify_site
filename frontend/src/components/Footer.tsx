import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clarify
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced Text Processing & JSON Manipulation System
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              15+ Professional Tools in One App
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/download"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  Download
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/JosueAmaral15/clarify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/JosueAmaral15/clarify/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  Report Bug
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/JosueAmaral15/clarify/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  Request Feature
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:josueamaral15@gmail.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-tech-blue transition-colors text-sm"
                >
                  josueamaral15@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Josué Amaral. Open Source (MIT License).
          </p>
        </div>
      </div>
    </footer>
  );
}
