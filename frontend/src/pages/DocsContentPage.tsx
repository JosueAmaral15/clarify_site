import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function DocsContentPage() {
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'overview';

  useEffect(() => {
    // Scroll to section if hash exists
    if (hash && hash !== 'overview') {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const sections = {
    'user-guide': {
      title: 'User Guide',
      icon: '📚',
      content: [
        {
          heading: 'Getting Started',
          text: 'Clarify is a powerful text processing and JSON manipulation tool designed to boost your productivity. This guide will help you master all its features.'
        },
        {
          heading: 'Search & Replace',
          text: 'Use advanced regex patterns to search and replace text across multiple files. Supports capture groups, lookaheads, and complex patterns.'
        },
        {
          heading: 'JSON Tools',
          text: 'Rewrite, translate, format, and manipulate JSON data with ease. Supports nested objects, array operations, and schema validation.'
        }
      ]
    },
    'api': {
      title: 'API Reference',
      icon: '⚙️',
      content: [
        {
          heading: 'REST API',
          text: 'Clarify provides a comprehensive REST API for programmatic access to all features. Authentication is done via API keys.'
        },
        {
          heading: 'Endpoints',
          text: 'Available endpoints: /api/search, /api/replace, /api/json/rewrite, /api/json/translate, /api/text/extract'
        },
        {
          heading: 'Rate Limits',
          text: 'Free tier: 100 requests/hour. Premium tier: 10,000 requests/hour. Contact us for enterprise plans.'
        }
      ]
    },
    'tutorials': {
      title: 'Tutorials',
      icon: '🎓',
      content: [
        {
          heading: 'Tutorial 1: Basic Text Processing',
          text: 'Learn how to perform basic search and replace operations, including regex patterns and multi-file operations.'
        },
        {
          heading: 'Tutorial 2: JSON Manipulation',
          text: 'Master JSON rewriting, translation, and schema transformation with practical examples.'
        },
        {
          heading: 'Tutorial 3: Advanced Features',
          text: 'Explore plugins, custom scripts, and automation workflows to maximize productivity.'
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      icon: '❓',
      content: [
        {
          heading: 'Is Clarify free?',
          text: 'Yes! Clarify is free to download and use. We offer premium features for advanced users.'
        },
        {
          heading: 'What platforms are supported?',
          text: 'Clarify supports Windows 10/11, macOS 11+, and Linux (Ubuntu 20.04+, Debian 11+).'
        },
        {
          heading: 'How do I report bugs?',
          text: 'Use the contact form on our website or email support@clarify.com with details about the issue.'
        },
        {
          heading: 'Can I use Clarify offline?',
          text: 'Yes! Most features work offline. Only cloud sync and API features require an internet connection.'
        }
      ]
    }
  };

  const currentSection = sections[hash as keyof typeof sections] || sections['user-guide'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 dark:text-cyan-400 hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/docs" className="text-blue-600 dark:text-cyan-400 hover:underline">Documentation</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-300">{currentSection.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                {Object.entries(sections).map(([key, section]) => (
                  <Link
                    key={key}
                    to={`/docs#${key}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      hash === key
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="text-5xl">{currentSection.icon}</span>
                {currentSection.title}
              </h1>

              <div className="space-y-8">
                {currentSection.content.map((item, idx) => (
                  <div key={idx} id={item.heading.toLowerCase().replace(/\s+/g, '-')}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {item.heading}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <Link
                    to="/docs"
                    className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Documentation
                  </Link>
                  <Link
                    to="/#contact"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    Need Help?
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
