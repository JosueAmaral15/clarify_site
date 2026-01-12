import { Link, useNavigate } from 'react-router-dom';
import { useDocSearch } from '../hooks/useDocSearch';
import { useRef, useEffect } from 'react';

export default function DocsPage() {
  const { searchQuery, setSearchQuery, results, hasResults } = useDocSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);
  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Installation', description: 'How to install Clarify on your system', href: '/docs/installation' },
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', href: '/docs/quick-start' },
        { title: 'System Requirements', description: 'Check if your system is compatible', href: '/docs/requirements' },
      ]
    },
    {
      category: 'Core Features',
      items: [
        { title: 'Search & Replace', description: 'Advanced regex-based search and replace', href: '/docs/search-replace' },
        { title: 'JSON Tools', description: 'Rewrite, translate, and manipulate JSON', href: '/docs/json-tools' },
        { title: 'Text Processing', description: 'Extract, transform, and format text', href: '/docs/text-processing' },
      ]
    },
    {
      category: 'Advanced',
      items: [
        { title: 'Plugin Development', description: 'Create custom plugins', href: '/docs/plugins' },
        { title: 'CLI & Automation', description: 'Command-line interface and automation', href: '/docs/api' },
        { title: 'Configuration', description: 'Customize Clarify to your needs', href: '/docs/config' },
      ]
    },
    {
      category: 'Support',
      items: [
        { title: 'FAQ', description: 'Frequently asked questions', href: '/docs/faq' },
        { title: 'Troubleshooting', description: 'Common issues and solutions', href: '/docs/troubleshooting' },
        { title: 'Community', description: 'Join our community forums', href: '/docs/community' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="section-padding pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Clarify
            <span className="gradient-text"> Documentation</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to master Clarify and boost your productivity.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search documentation... (press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Search Results Dropdown */}
            {hasResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      to={result.url}
                      onClick={() => setSearchQuery('')}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <span className="text-2xl">{result.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                          {result.title}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery.length >= 2 && !hasResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No results found for "<span className="font-semibold">{searchQuery}</span>"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Try different keywords or browse the sections below
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12">
            {docs.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {section.category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={`/docs${item.href}`}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all group border-2 border-transparent hover:border-blue-500 dark:hover:border-cyan-500 block"
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                        <svg className="inline-block ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">Popular Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                User Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Complete guide for all features
              </p>
              <a href="#user-guide" className="text-blue-600 dark:text-cyan-400 hover:underline text-sm font-semibold">
                Read Guide →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                API Docs
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Complete API reference
              </p>
              <a href="#api" className="text-blue-600 dark:text-cyan-400 hover:underline text-sm font-semibold">
                View API →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Tutorials
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Step-by-step tutorials
              </p>
              <a href="#tutorials" className="text-blue-600 dark:text-cyan-400 hover:underline text-sm font-semibold">
                Start Learning →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                FAQ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Common questions answered
              </p>
              <a href="#faq" className="text-blue-600 dark:text-cyan-400 hover:underline text-sm font-semibold">
                View FAQ →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - with proper spacing */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need Help?
          </h2>
          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/#contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@clarify.com"
              className="bg-gray-700 dark:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-600 dark:hover:bg-gray-500 transition-all text-lg border-2 border-white/20"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
