import { Link } from 'react-router-dom';
import FeaturesGrid from '../components/FeaturesGrid';
import ToolsShowcase from '../components/ToolsShowcase';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="section-padding pt-32 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for
            <span className="gradient-text"> Text Processing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Clarify provides 15+ professional-grade tools to streamline your text processing, JSON manipulation, and development workflows.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/download"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all text-lg shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Download Now
            </Link>
            <Link
              to="/docs"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all text-lg shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <FeaturesGrid />
      </section>

      {/* Tools Showcase */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800/50">
        <ToolsShowcase />
      </section>

      {/* Why Clarify Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">Why Choose Clarify?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process 10MB JSON files in under 2 seconds. Optimized algorithms ensure maximum performance even with large datasets.
              </p>
            </div>

            {/* Quality */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Production Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                97% test coverage, 70,000+ lines of code, and 212+ commits. Battle-tested in real-world scenarios.
              </p>
            </div>

            {/* Extensibility */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Extensible
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Plugin system with hot reload. Extend functionality without modifying core code. Build custom tools for your workflow.
              </p>
            </div>

            {/* Cross-Platform */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Cross-Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Native support for Windows, Linux (.deb), and macOS. Same experience across all platforms.
              </p>
            </div>

            {/* i18n */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Multilingual
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built-in support for 7 languages (EN, PT-BR, ES, FR, DE, IT, JA). Easy to add new translations.
              </p>
            </div>

            {/* Free to Use */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Free to Use
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free to download and use. Professional-grade tools without any cost or hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8">
            Download Clarify and experience powerful text processing tools.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/download"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all text-lg shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Download Now
            </Link>
            <Link
              to="/docs"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all text-lg shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
