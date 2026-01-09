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
          heading: 'Prerequisites',
          text: 'Python 3.8 or higher required. PySide6 (Qt for Python) will be installed automatically with dependencies.'
        },
        {
          heading: 'Install via pip',
          text: 'Clone the repository: git clone https://github.com/JosueAmaral15/clarify.git && cd clarify. Then install dependencies: pip install -r requirements.txt (or use poetry install if you have Poetry).'
        },
        {
          heading: 'Launch Application',
          text: 'Run python main.py to start the GUI. Alternatively, use the launchers: ./launchers/clarify_gui.sh (Linux/macOS) or launchers/clarify_gui.bat (Windows).'
        },
        {
          heading: 'Verify Installation',
          text: 'On first launch, verify all tools are available in the Tools menu. The application uses Qt Fusion style by default with system theme, customizable via Themes menu.'
        }
      ]
    },
    'quick-start': {
      title: 'Quick Start Guide',
      icon: '🚀',
      content: [
        {
          heading: 'What is Clarify?',
          text: 'Clarify is a professional desktop application for text processing, JSON manipulation, and AI-assisted workflows. Perfect for developers needing to internationalize apps, clean messy data, or automate repetitive text transformations.'
        },
        {
          heading: 'First Steps',
          text: 'After launching, explore the Tools menu to find 10+ specialized tools: Search & Replace (batch find/replace with regex), JSON Rewriter (dedupe & transform), JSON Translator (i18n with AI), Text Extractor (JSX to JSON), Case Converter, AI Processor (ChatGPT/Gemini integration), Set Operations, and more.'
        },
        {
          heading: 'Try JSON Translation (Example)',
          text: 'Open Tools → JSON Translate. Select your React/Vue .tsx/.jsx file as input. Choose output path (e.g., locales/en.json). Set root variable to "t" and click Process. Clarify extracts all hardcoded text strings and generates hierarchical JSON translation keys automatically.'
        },
        {
          heading: 'Common Workflows',
          text: 'Internationalize React apps: Extract text with JSON Translate → Translate with AI Processor → Replace strings with Search & Replace. Clean messy JSON: Load in JSON Rewriter → Enable "Eliminate Duplicates" + "Remove Empty Values" → Apply consistent casing. Find orphaned i18n keys: Use JSON Search to check if keys are referenced in codebase.'
        }
      ]
    },
    'requirements': {
      title: 'System Requirements',
      icon: '💻',
      content: [
        {
          heading: 'Software Requirements',
          text: 'Python 3.8 or higher (Python 3.12+ recommended for best performance). PySide6 6.10.1+ for GUI. Works on Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+, Debian 11+, Fedora, CentOS).'
        },
        {
          heading: 'Hardware Requirements',
          text: 'Minimum: 4GB RAM, 500MB free storage, dual-core 2.0 GHz processor. Recommended: 8GB+ RAM, 1GB storage, quad-core 2.5+ GHz for optimal performance with large files (10MB+ JSON/text files).'
        },
        {
          heading: 'Optional Dependencies',
          text: 'For AI features: openai package (ChatGPT integration), google-generativeai (Gemini integration), tiktoken (token counting). For advanced formats: pymongo (BSON), toon-llm (TOON format). All optional, install only if needed.'
        }
      ]
    },
    'search-replace': {
      title: 'Search & Replace',
      icon: '🔍',
      content: [
        {
          heading: 'Batch Find & Replace',
          text: 'Search and replace across multiple files simultaneously with support for regex patterns, case-sensitive/insensitive matching, and whole word matching. Perfect for refactoring codebases or updating variable names project-wide.'
        },
        {
          heading: 'Advanced Regex Support',
          text: 'Full regex support with capture groups and backreferences. Use patterns like (\\w+)@(\\w+\\.\\w+) for emails, \\d{3}-\\d{3}-\\d{4} for phone numbers, or \\b[A-Z]{2,}\\b for acronyms. Replace with $1, $2 to reference captured groups.'
        },
        {
          heading: 'Scope Filtering',
          text: 'Process only text inside specific contexts: <div>...</div> tags, {...} code blocks, /* comments */, or custom delimiters. Prevents accidental modifications to code structure while targeting content only.'
        },
        {
          heading: 'Advanced Conditions',
          text: 'Filter files by size, modification date, file extensions, or custom regex patterns. Combine multiple conditions with AND/OR logic. Process only files modified in the last 7 days or larger than 1MB with specific extensions (.tsx, .jsx).'
        }
      ]
    },
    'json-tools': {
      title: 'JSON Tools',
      icon: '📄',
      content: [
        {
          heading: 'JSON Rewriter - Deduplication & Cleaning',
          text: 'Remove duplicate key-value pairs, eliminate keys with duplicate values, join duplicate keys into arrays, skip empty values, and remove serial hierarchies (keys without siblings). Reduces i18n file sizes by 20-40% while maintaining structure. Convert arrays to objects with smart camelCase key generation.'
        },
        {
          heading: 'JSON Translator - AI-Powered i18n',
          text: 'Translate JSON/TypeScript dictionary values using AI while preserving structure. Supports OpenAI ChatGPT and Google Gemini. Load dictionary (JSON or TypeScript format), select target language, and translate entire i18n files in seconds. Perfect for maintaining multi-language applications.'
        },
        {
          heading: 'JSON Search - Find Keys & Values',
          text: 'Advanced search engine for finding keys/values across JSON files or entire codebases. Search by key only, value only, or both with regex support. Build index for fast searches across 10GB+ directories. Use case: Find orphaned i18n keys by searching codebase for usage (0 matches = orphaned, safe to delete).'
        },
        {
          heading: 'Set Operations - Merge & Compare',
          text: 'Mathematical set operations on JSON files: Union (∪) merges all unique items, Intersection (∩) finds common fields across all files, Difference (−) shows what\'s in A but not B, Symmetric Difference (⊕) shows items unique to each. Compare by keys only, keys+values, or full paths. Perfect for validating schema consistency across microservices or finding missing translation keys.'
        }
      ]
    },
    'text-processing': {
      title: 'Text Processing',
      icon: '📝',
      content: [
        {
          heading: 'Text Extractor - JSX to JSON',
          text: 'Extract text from React/Vue components for internationalization. Dual-mode extraction: Attribute mode captures key="value" props (placeholder, title, alt), Tag-content mode extracts <div>inner text</div>. Generates hierarchical JSON with smart key naming. Filters: only_strings, avoid_keys, no_standard HTML attributes. Perfect for converting hardcoded strings to i18n keys.'
        },
        {
          heading: 'Case Converter - Naming Conventions',
          text: 'Convert identifiers between camelCase, PascalCase, snake_case, and kebab-case. Syntax-aware for JavaScript/TypeScript. Batch process entire codebases to standardize naming conventions. Handles edge cases: acronyms (HTML→html), numbers (user2fa→user2Fa), Unicode characters (café→cafe).'
        },
        {
          heading: 'Placeholder Replacer - Template Variables',
          text: 'Replace template variables like {{name}}, {{email}}, {{date}} with values from JSON dictionary. Supports custom placeholder formats ($var$, %var%, {var}). Case-sensitive/insensitive matching. Perfect for email templates, config generation, and code scaffolding. Batch process 1000+ templates in seconds.'
        },
        {
          heading: 'Format Converters - 15 Formats',
          text: 'Bidirectional conversion between 15+ formats: JSON, YAML, TOML, XML, CSV (standard), MessagePack, Protobuf, Avro, Thrift (binary), Parquet, ORC, Ion (columnar), CBOR, BSON, TOON (specialized). Encode and decode with schema validation. Convert legacy XML configs to modern JSON or compress JSON to binary MessagePack for APIs.'
        }
      ]
    },
    'plugins': {
      title: 'Plugin Development',
      icon: '🔌',
      content: [
        {
          heading: 'Plugin System Architecture (v2.9.109)',
          text: 'Dynamic plugin loading with hot reload without restart. Base classes (BasePlugin, BaseProcessor) with lifecycle hooks (on_load, on_enable, on_disable, on_unload). Event system for inter-plugin communication. Plugin API provides access to core functionality: file I/O, text processing, UI integration, and shared state management.'
        },
        {
          heading: 'Included Plugins',
          text: 'PostgreSQL Export Plugin: Export JSON/CSV data directly to PostgreSQL databases with automatic schema detection and table creation. Slack Notifications Plugin: Send processing results, errors, or custom notifications to Slack channels via webhooks. Both plugins are production-ready examples demonstrating the plugin API capabilities.'
        },
        {
          heading: 'Creating Custom Plugins',
          text: 'Plugins are Python modules (.py files) placed in the plugins/ directory. Inherit from BasePlugin, implement required hooks (process, get_name, get_description), and register with plugin manager. Access Clarify core APIs: FileWalker for file operations, text processors for transformations, GUI components for custom docks. Full TypeScript-style type hints included for IDE autocomplete.'
        },
        {
          heading: 'Testing & Distribution',
          text: 'Test plugins with 15 unit tests included in tests/test_plugin_system.py. Use pytest for automated testing. Distribute plugins via GitHub as standalone .py files or as pip packages. Plugin registry coming in v2.10 for community plugin sharing and discovery.'
        }
      ]
    },
    'config': {
      title: 'Configuration',
      icon: '⚙️',
      content: [
        {
          heading: 'Theme System',
          text: 'Three visual themes: Light ☀️ (clean, professional for bright environments), Dark 🌙 (reduced eye strain for extended use), System 🖥️ (auto-matches OS settings). Change via Themes menu. Preferences saved to ~/.config/clarify.conf (Linux/Mac) or %APPDATA%/Clarify (Windows). Comprehensive QSS styling for all Qt components.'
        },
        {
          heading: 'Keyboard Shortcuts',
          text: 'Fully customizable shortcuts with conflict detection. Open customizer: Help → Customize Shortcuts (or Ctrl+K Ctrl+S). Double-click any shortcut to reassign. Built-in OS conflict warnings prevent overriding system shortcuts. Import/export shortcut profiles as JSON. Default shortcuts: Ctrl+Z/Y (Undo/Redo), Ctrl+S (Save), Ctrl+Shift+F (Advanced Search), Ctrl+Q (Quit).'
        },
        {
          heading: 'AI API Configuration',
          text: 'Configure AI providers: OpenAI (ChatGPT) requires API key from platform.openai.com, supports GPT-4 Turbo, GPT-3.5 Turbo. Google Gemini requires API key from ai.google.dev, supports Flash 1.5 (cheaper), Pro (higher quality). Token tracking displays session and lifetime usage. Code fence removal automatically strips ```json from AI responses.'
        },
        {
          heading: 'i18n Language Settings',
          text: 'Clarify supports 7 languages with complete UI translation: English, Portuguese (Brazil), Spanish, French, German, Italian, Japanese. Change language in Settings → Language. All menu items, tooltips, error messages, and documentation translated. Community contributions welcome for additional languages via GitHub.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: '🔧',
      content: [
        {
          heading: 'Installation Issues',
          text: 'If pip install fails, ensure Python 3.8+ is installed (python --version) and pip is up-to-date (pip install --upgrade pip). For PySide6 installation errors on Linux, install Qt dependencies: sudo apt install python3-pyqt6 libxcb-xinerama0 (Ubuntu/Debian). On macOS, use brew install python@3.12 for latest Python.'
        },
        {
          heading: 'Performance & Memory',
          text: 'For large files (100MB+ JSON), processing may take 20-60 seconds. Check performance benchmarks: 10MB JSON dedupe ~2s, 100MB ~19s. If app crashes with large files, increase system memory or process files in batches. Use CLI mode for automated batch processing to avoid GUI overhead.'
        },
        {
          heading: 'Common Errors',
          text: 'JSON Parse Error: Check syntax with online validator. File Not Found: Verify absolute paths, not relative. Permission Denied: Run with appropriate file permissions or use sudo (Linux/Mac). Import Error: Reinstall dependencies with pip install -r requirements.txt --force-reinstall. Qt Platform Plugin Error: Install missing Qt libraries or set QT_QPA_PLATFORM=offscreen for headless environments.'
        }
      ]
    },
    'community': {
      title: 'Community & Support',
      icon: '👥',
      content: [
        {
          heading: 'GitHub Community',
          text: 'Clarify is open-source on GitHub: github.com/JosueAmaral15/clarify. Report bugs via Issues, suggest features in Discussions, or browse the wiki for extended documentation. 70,000+ lines of code, 212+ commits, 97% test coverage. MIT License - free to use, modify, and distribute.'
        },
        {
          heading: 'Contributing',
          text: 'Contributions welcome! Fork the repo, create a feature branch, make changes with tests, and submit a Pull Request. Check CONTRIBUTING.md for code style guidelines (Black formatter, Pylint 9.0+, type hints 80%+ coverage). Add tests (pytest) and ensure 95%+ coverage for new features. All PRs reviewed within 48 hours.'
        },
        {
          heading: 'Built-in AI Assistant',
          text: 'Get instant help with Clarify features using the integrated AI chatbot. Access via Help → AI Assistant menu. Ask questions like: "How do I use regex in Search & Replace?", "What\'s the difference between dedupe and join_keys?", "Show me an example of scope filtering". Powered by OpenAI/Gemini (requires API key configuration).'
        }
      ]
    },
    'user-guide': {
      title: 'User Guide',
      icon: '📚',
      content: [
        {
          heading: 'Overview - What Makes Clarify Unique',
          text: 'Clarify (v2.9.111) is production-ready with 70,000+ LOC, 97% test coverage (91/94 tests passing), and 18+ design patterns (Strategy, Factory, Observer, Command, Memento). Built with Python 3.12+ and PySide6 (Qt). Modular architecture with 10+ specialized tools, plugin system for extensibility, and full CLI interface for automation. Used by developers for i18n workflows, data cleaning, and batch text processing.'
        },
        {
          heading: 'Core Features & Tools',
          text: 'Search & Replace: Batch find/replace with regex, scope filtering, advanced conditions. JSON Tools: Rewriter (dedupe/clean), Translator (AI i18n), Search (find keys/values), Set Operations (merge/compare). Text Processing: Extractor (JSX→JSON), Case Converter (camelCase/snake_case), Placeholder Replacer, Format Converters (15 formats). AI Processor: ChatGPT/Gemini integration for refactoring, translation, test generation. Advanced: Insert Panel with regex capture ($0-$99), Memory Register system, multi-file batch processing.'
        },
        {
          heading: 'Common Workflows & Use Cases',
          text: 'Internationalize React/Vue apps: Extract text → Translate with AI → Replace strings. Clean messy i18n JSON: Dedupe + eliminate duplicates + consistent casing (20-40% size reduction). Find orphaned translation keys: Search codebase for key usage (0 matches = safe to delete). Standardize code naming: Convert entire codebase to camelCase/snake_case. Validate schema consistency: Use Set Operations intersection to find common fields across microservices. Automate with CLI: Integrate into Git hooks for pre-commit JSON validation or CI/CD pipelines.'
        }
      ]
    },
    'api': {
      title: 'CLI & Automation',
      icon: '⚙️',
      content: [
        {
          heading: 'Command-Line Interface',
          text: 'Full CLI interface for automation and scripting. Use python -m src.app [command] [options]. Available commands: search (find patterns), replace (batch replacements), insert (add text at positions), translate (JSON translation), dedupe (JSON rewriting), and more. All GUI features accessible via CLI for CI/CD pipelines.'
        },
        {
          heading: 'CLI Examples',
          text: 'Search: python -m src.app search ./src --query "function" --include "*.py". Replace: python -m src.app replace ./src --query "oldName" --replacement "newName" --all. Translate: python -m src.app translate ./locales --dictionary dict.json. Dedupe: python -m src.app dedupe en.json --join-keys --eliminate-duplicates.'
        },
        {
          heading: 'Batch Automation Scripts',
          text: 'Create shell scripts for complex workflows: for file in locales/*.json; do python -m src.app dedupe "$file"; done. Chain operations with && for sequential processing. Integrate with Git hooks for pre-commit validation of JSON files or automatic i18n key cleanup.'
        }
      ]
    },
    'tutorials': {
      title: 'Tutorials',
      icon: '🎓',
      content: [
        {
          heading: 'Tutorial 1: Internationalize React App (10 min)',
          text: 'Learn how to extract hardcoded text from React components and generate i18n JSON files. Use JSON Translate to extract from .tsx/.jsx files → creates hierarchical JSON with smart keys (hello_world, welcome_message). Then use Search & Replace to replace strings with {t.key.path} references. Example: <h1>Hello</h1> becomes <h1>{t.pages.home.hello}</h1>.'
        },
        {
          heading: 'Tutorial 2: Clean Messy JSON (5 min)',
          text: 'Use JSON Rewriter to clean i18n files with duplicates. Enable "Eliminate Duplicates" to remove duplicate key-value pairs, "Join Duplicate Keys" to merge arrays, "Remove Empty Values" for null cleanup. Results: 23-40% file size reduction, cleaner structure, faster parsing. Example: 242 keys → 186 keys (-23%), 185KB → 142KB (-43KB).'
        },
        {
          heading: 'Tutorial 3: Find Orphaned i18n Keys (3 min)',
          text: 'Use JSON Search to find unused translation keys. Search your codebase (./src) for each i18n key (e.g., "t.pages.home.title"). If 0 matches found, key is orphaned and safe to delete. Automate with script: for key in $(jq -r "keys[]" en.json); do grep -r "$key" src/ || echo "Orphaned: $key"; done.'
        },
        {
          heading: 'Tutorial 4: AI-Assisted Refactoring (15 min)',
          text: 'Use AI Processor to refactor legacy code. Open Tools → AI Processor, select Python file, choose GPT-4 Turbo provider. Write instruction: "Refactor into classes following SOLID principles, add type hints and docstrings". Click Process. Review AI-generated code (~45s, $0.15 cost). Saves 90% of manual refactoring time while maintaining functionality.'
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
