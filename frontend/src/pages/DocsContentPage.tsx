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
    'installation': {
      title: 'Installation',
      icon: '📥',
      content: [
        {
          heading: 'Windows Installation',
          text: 'Download the Windows installer (.exe) and run it. Follow the setup wizard to complete installation. Clarify will be added to your Start Menu and desktop.'
        },
        {
          heading: 'macOS Installation',
          text: 'Download the macOS package (.dmg), open it, and drag Clarify to your Applications folder. You may need to allow the app in System Preferences > Security & Privacy.'
        },
        {
          heading: 'Linux Installation',
          text: 'Download the .deb package for Debian/Ubuntu or .rpm for Fedora/CentOS. Install using: sudo dpkg -i clarify.deb (Debian/Ubuntu) or sudo rpm -i clarify.rpm (Fedora/CentOS).'
        },
        {
          heading: 'Verification',
          text: 'After installation, run "clarify --version" in your terminal to verify the installation was successful.'
        }
      ]
    },
    'quick-start': {
      title: 'Quick Start Guide',
      icon: '🚀',
      content: [
        {
          heading: 'Step 1: Launch Clarify',
          text: 'Open Clarify from your Applications folder (macOS), Start Menu (Windows), or Applications menu (Linux).'
        },
        {
          heading: 'Step 2: Choose Your Tool',
          text: 'Select from 15+ powerful tools: Search & Replace, JSON Tools, Text Processing, and more. Each tool has a dedicated interface optimized for that task.'
        },
        {
          heading: 'Step 3: Process Your Data',
          text: 'Load your file or paste text directly. Configure your processing options and click "Process" to see results instantly.'
        },
        {
          heading: 'Step 4: Save or Export',
          text: 'Save your results to a new file, copy to clipboard, or export in various formats (txt, json, csv, etc.).'
        }
      ]
    },
    'requirements': {
      title: 'System Requirements',
      icon: '💻',
      content: [
        {
          heading: 'Minimum Requirements',
          text: 'OS: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+) | RAM: 4GB | Storage: 500MB | Processor: Dual-core 2.0 GHz'
        },
        {
          heading: 'Recommended Requirements',
          text: 'OS: Windows 11, macOS 13+, Linux (Ubuntu 22.04+) | RAM: 8GB+ | Storage: 1GB | Processor: Quad-core 2.5+ GHz'
        },
        {
          heading: 'Additional Requirements',
          text: 'Internet connection required for: API features, cloud sync, updates, and AI-powered tools (OpenAI/Gemini integration).'
        }
      ]
    },
    'search-replace': {
      title: 'Search & Replace',
      icon: '🔍',
      content: [
        {
          heading: 'Basic Search',
          text: 'Enter your search term to find all occurrences in your text. Use case-sensitive or case-insensitive matching.'
        },
        {
          heading: 'Regular Expressions',
          text: 'Use regex patterns for advanced searching: \\d+ for numbers, [A-Z]+ for uppercase words, (\\w+)@(\\w+) for emails. Supports capture groups and backreferences.'
        },
        {
          heading: 'Replace Operations',
          text: 'Replace single or all occurrences. Use $1, $2 for capture group replacements. Preview changes before applying.'
        },
        {
          heading: 'Multi-File Search',
          text: 'Search across multiple files simultaneously. Filter by file type, apply batch replacements, and save modified files.'
        }
      ]
    },
    'json-tools': {
      title: 'JSON Tools',
      icon: '📄',
      content: [
        {
          heading: 'JSON Validation',
          text: 'Automatically validate JSON syntax. Highlights errors with line numbers and detailed error messages.'
        },
        {
          heading: 'JSON Formatting',
          text: 'Format and prettify JSON with customizable indentation (2, 4 spaces or tabs). Minify JSON to reduce file size.'
        },
        {
          heading: 'JSON Transformation',
          text: 'Rewrite JSON structures, extract specific fields, flatten nested objects, or merge multiple JSON files.'
        },
        {
          heading: 'JSON Translation',
          text: 'Translate JSON values using AI (OpenAI/Gemini). Preserve structure while translating content across 7 supported languages.'
        }
      ]
    },
    'text-processing': {
      title: 'Text Processing',
      icon: '📝',
      content: [
        {
          heading: 'Text Extraction',
          text: 'Extract emails, URLs, phone numbers, dates, or custom patterns from any text using regex or built-in extractors.'
        },
        {
          heading: 'Text Transformation',
          text: 'Convert case (uppercase, lowercase, title case), remove duplicates, sort lines, trim whitespace, and more.'
        },
        {
          heading: 'Text Formatting',
          text: 'Add prefixes/suffixes, wrap text, split/join lines, format lists, and apply custom transformations.'
        },
        {
          heading: 'Batch Processing',
          text: 'Process multiple text files at once. Apply transformations to entire folders with file filtering.'
        }
      ]
    },
    'plugins': {
      title: 'Plugin Development',
      icon: '🔌',
      content: [
        {
          heading: 'Getting Started with Plugins',
          text: 'Clarify supports custom plugins written in JavaScript/TypeScript. Extend functionality and create custom tools tailored to your workflow.'
        },
        {
          heading: 'Plugin API',
          text: 'Use the Clarify Plugin API to access core functionality: text processing, file I/O, UI components, and more. Full TypeScript definitions included.'
        },
        {
          heading: 'Creating Your First Plugin',
          text: 'Use the plugin template generator: clarify create-plugin my-plugin. Edit plugin.js, add your logic, and install locally for testing.'
        },
        {
          heading: 'Publishing Plugins',
          text: 'Share your plugins with the community. Publish to the Clarify Plugin Registry or distribute via GitHub.'
        }
      ]
    },
    'config': {
      title: 'Configuration',
      icon: '⚙️',
      content: [
        {
          heading: 'General Settings',
          text: 'Customize theme (light/dark/auto), language preference, default file locations, and auto-save behavior.'
        },
        {
          heading: 'Editor Settings',
          text: 'Configure font size, line wrapping, syntax highlighting, and keyboard shortcuts for optimal productivity.'
        },
        {
          heading: 'API Configuration',
          text: 'Set up API keys for OpenAI and Gemini integration. Configure rate limits and usage preferences.'
        },
        {
          heading: 'Advanced Settings',
          text: 'Enable debug mode, configure logging, set memory limits, and customize plugin paths.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: '🔧',
      content: [
        {
          heading: 'Common Issues',
          text: 'Installation fails: Check system requirements and admin permissions. App crashes: Clear cache and reinstall. Slow performance: Check available RAM and close other apps.'
        },
        {
          heading: 'Error Messages',
          text: 'Parse Error: Check JSON syntax. File Not Found: Verify file path. Permission Denied: Run with appropriate permissions.'
        },
        {
          heading: 'Getting Help',
          text: 'Check logs in ~/.clarify/logs (Linux/Mac) or %APPDATA%/Clarify/logs (Windows). Report bugs via our contact form or email support@clarify.com.'
        }
      ]
    },
    'community': {
      title: 'Community',
      icon: '👥',
      content: [
        {
          heading: 'Join the Community',
          text: 'Connect with other Clarify users on our community forums, Discord server, and GitHub discussions. Share tips, ask questions, and collaborate.'
        },
        {
          heading: 'Contributing',
          text: 'Clarify welcomes contributions! Report bugs, suggest features, or contribute to documentation. Check our GitHub repository for contribution guidelines.'
        },
        {
          heading: 'Stay Updated',
          text: 'Follow us on Twitter/X for updates, tips, and announcements. Subscribe to our newsletter for release notes and feature highlights.'
        }
      ]
    },
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
