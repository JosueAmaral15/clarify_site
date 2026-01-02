import { useState } from 'react';

export default function ToolsShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tools = [
    {
      id: 0,
      name: 'JSON Translate',
      icon: '🌐',
      description: 'Translate JSON files to multiple languages using AI. Supports 50+ languages with context-aware translation.',
      features: [
        'AI-powered translation (OpenAI + Gemini)',
        'Preserves JSON structure',
        'Batch translation',
        'Context-aware for better accuracy',
      ],
      screenshot: '📊', // Placeholder emoji
    },
    {
      id: 1,
      name: 'Search & Replace',
      icon: '🔍',
      description: 'Advanced text search and replace with regex support, multi-file processing, and preview mode.',
      features: [
        'Regular expressions support',
        'Case-sensitive/insensitive',
        'Preview before replace',
        'Multi-file batch processing',
      ],
      screenshot: '📝',
    },
    {
      id: 2,
      name: 'JSON Rewriter',
      icon: '✏️',
      description: 'Transform and restructure JSON data with AI assistance. Automatic schema generation and validation.',
      features: [
        'AI-assisted restructuring',
        'Schema generation',
        'Data validation',
        'Format conversion (JSON, YAML, XML)',
      ],
      screenshot: '🔄',
    },
    {
      id: 3,
      name: 'File Explorer',
      icon: '📂',
      description: 'Advanced file management with search, filtering, bulk operations, and integration with all Clarify tools.',
      features: [
        'Fast search across directories',
        'File type filtering',
        'Bulk rename/move/delete',
        'Integration with Clarify tools',
      ],
      screenshot: '🗂️',
    },
    {
      id: 4,
      name: 'Multi-Query Search',
      icon: '🔎',
      description: 'Execute multiple search queries simultaneously. Export results to various formats.',
      features: [
        'Parallel search execution',
        'Custom query patterns',
        'Export to CSV/JSON/Excel',
        'Search history and favorites',
      ],
      screenshot: '📈',
    },
  ];

  const activeTool = tools[activeTab];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Tools at Your Fingertips
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our most popular tools designed to streamline your workflow and boost productivity.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === index
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="hidden sm:inline">{tool.name}</span>
              </button>
            ))}
          </div>

          {/* Tool Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Left: Tool Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{activeTool.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeTool.name}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {activeTool.description}
                </p>

                {/* Features List */}
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Key Features:
                </h4>
                <ul className="space-y-2 mb-6">
                  {activeTool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href="/features"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Learn More →
                </a>
              </div>

              {/* Right: Screenshot/Visual */}
              <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-9xl mb-4">{activeTool.screenshot}</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Screenshot placeholder
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                    Actual UI screenshots coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Navigation */}
            <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 flex justify-between items-center">
              <button
                onClick={() => setActiveTab((activeTab - 1 + tools.length) % tools.length)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                ← Previous Tool
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab + 1} / {tools.length}
              </span>
              <button
                onClick={() => setActiveTab((activeTab + 1) % tools.length)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Next Tool →
              </button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to explore all 15+ tools?
            </p>
            <a
              href="/features"
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Tools →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
