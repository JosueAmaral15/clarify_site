// Documentation search data - extracted from DocsContentPage sections
// This allows the search functionality to index all documentation content

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  url: string;
  searchableContent: string;
  headings: string[];
}

// All documentation sections with searchable content
export const documentationData: DocSection[] = [
  {
    id: 'installation',
    title: 'Installation',
    icon: '📥',
    url: '/docs/installation',
    searchableContent: 'installation install setup python pip prerequisites pyside6 qt requirements dependencies poetry clone repository github launch start gui verify',
    headings: ['Prerequisites', 'Install via pip', 'Launch Application', 'Verify Installation']
  },
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    icon: '🚀',
    url: '/docs/quick-start',
    searchableContent: 'quick start guide getting started tutorial first steps tools menu search replace json rewriter translator text extractor case converter ai processor chatgpt gemini workflow examples',
    headings: ['What is Clarify?', 'First Steps', 'Example 1: Search & Replace', 'Example 2: JSON Translation']
  },
  {
    id: 'requirements',
    title: 'System Requirements',
    icon: '💻',
    url: '/docs/requirements',
    searchableContent: 'system requirements minimum recommended hardware software python version memory disk space os windows linux mac macos ubuntu debian fedora performance',
    headings: ['Minimum Requirements', 'Recommended Specifications', 'Supported Operating Systems', 'Python Version']
  },
  {
    id: 'search-replace',
    title: 'Search & Replace',
    icon: '🔍',
    url: '/docs/search-replace',
    searchableContent: 'search replace find regex pattern scope filtering directory recursive advanced batch processing multi-file preview mode case sensitive insensitive',
    headings: ['Basic Search', 'Regular Expressions', 'Scope Filtering', 'Advanced Features']
  },
  {
    id: 'json-tools',
    title: 'JSON Tools',
    icon: '📄',
    url: '/docs/json-tools',
    searchableContent: 'json rewriter deduplication cleaning translator ai powered i18n search keys values set operations merge compare union intersection difference translation dedupe eliminate duplicates',
    headings: ['JSON Rewriter - Deduplication & Cleaning', 'JSON Translator - AI-Powered i18n', 'JSON Search - Find Keys & Values', 'Set Operations - Merge & Compare']
  },
  {
    id: 'text-processing',
    title: 'Text Processing',
    icon: '📝',
    url: '/docs/text-processing',
    searchableContent: 'text processing extractor jsx json react vue components case converter camelcase pascalcase snake_case kebab-case placeholder replacer template variables format converters yaml toml xml csv',
    headings: ['Text Extractor - JSX to JSON', 'Case Converter - Naming Conventions', 'Placeholder Replacer - Template Variables', 'Format Converters - 15 Formats']
  },
  {
    id: 'plugins',
    title: 'Plugin Development',
    icon: '🔌',
    url: '/docs/plugins',
    searchableContent: 'plugin development system architecture hot reload base classes lifecycle hooks event communication api file io postgresql slack custom plugins testing distribution',
    headings: ['Plugin System Architecture', 'Included Plugins', 'Creating Custom Plugins', 'Testing & Distribution']
  },
  {
    id: 'api',
    title: 'CLI & Automation',
    icon: '⚙️',
    url: '/docs/api',
    searchableContent: 'cli command line interface automation scripting batch python api commands search replace insert translate dedupe export examples shell scripts git hooks ci cd pipeline',
    headings: ['Command-Line Interface', 'CLI Examples', 'Batch Automation Scripts']
  },
  {
    id: 'config',
    title: 'Configuration',
    icon: '⚙️',
    url: '/docs/config',
    searchableContent: 'configuration settings theme system light dark keyboard shortcuts customization ai api openai gemini gpt language internationalization i18n preferences',
    headings: ['Theme System', 'Keyboard Shortcuts', 'AI API Configuration', 'i18n Language Settings']
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '🔧',
    url: '/docs/troubleshooting',
    searchableContent: 'troubleshooting issues problems errors installation performance memory json parse file not found permission denied import error qt platform plugin crash bugs fixes solutions',
    headings: ['Installation Issues', 'Performance & Memory', 'Common Errors']
  },
  {
    id: 'community',
    title: 'Community & Support',
    icon: '👥',
    url: '/docs/community',
    searchableContent: 'community support github open source issues discussions wiki contributing pull request code style tests ai assistant chatbot help features forum',
    headings: ['GitHub Community', 'Contributing', 'Built-in AI Assistant']
  },
  {
    id: 'user-guide',
    title: 'User Guide',
    icon: '📚',
    url: '/docs/user-guide',
    searchableContent: 'user guide overview features tools search replace json text processing ai workflow i18n internationalize react vue clean data standardize naming validate schema automate',
    headings: ['Overview - What Makes Clarify Unique', 'Core Features & Tools', 'Common Workflows & Use Cases']
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    icon: '🎓',
    url: '/docs/tutorials',
    searchableContent: 'tutorials step by step guide internationalize react app clean json find orphaned keys ai refactoring beginner advanced examples walkthrough',
    headings: ['Tutorial 1: Internationalize React App', 'Tutorial 2: Clean Messy JSON', 'Tutorial 3: Find Orphaned i18n Keys', 'Tutorial 4: AI-Assisted Refactoring']
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: '❓',
    url: '/docs/faq',
    searchableContent: 'faq frequently asked questions free price cost platforms windows macos linux bugs report offline cloud sync support help',
    headings: ['Is Clarify free?', 'What platforms are supported?', 'How do I report bugs?', 'Can I use Clarify offline?']
  }
];

// Create search index for titles, headings, and content
export function createSearchIndex() {
  return documentationData.map(doc => ({
    id: doc.id,
    title: doc.title,
    url: doc.url,
    icon: doc.icon,
    searchText: `${doc.title} ${doc.headings.join(' ')} ${doc.searchableContent}`.toLowerCase()
  }));
}
