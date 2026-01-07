import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function FeaturesGrid() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const features = [
    {
      id: 1,
      icon: '🛠️',
      title: '15+ Professional Tools',
      description: 'Comprehensive suite of text processing, JSON manipulation, and file management tools in one application.',
    },
    {
      id: 2,
      icon: '🤖',
      title: 'AI Integration',
      description: 'Powered by OpenAI and Google Gemini for intelligent text processing, translation, and content generation.',
    },
    {
      id: 3,
      icon: '🌍',
      title: '7 Languages Support',
      description: 'Built-in internationalization (i18n) with support for English, Portuguese, Spanish, French, German, Japanese, and Chinese.',
    },
    {
      id: 4,
      icon: '✅',
      title: '97% Test Coverage',
      description: 'Enterprise-grade quality with 97% test coverage, 70,000+ lines of code, and 212+ commits.',
    },
    {
      id: 5,
      icon: '🔌',
      title: 'Plugin System',
      description: 'Extensible architecture with hot reload support. Create custom tools and extend functionality easily.',
    },
    {
      id: 6,
      icon: '⚡',
      title: 'High Performance',
      description: 'Process 10MB JSON files in under 2 seconds. Optimized for speed and efficiency.',
    },
    {
      id: 7,
      icon: '💻',
      title: 'Cross-Platform',
      description: 'Available for Windows, Linux (.deb), and macOS. Same experience across all platforms.',
    },
    {
      id: 8,
      icon: '🆓',
      title: 'Free to Use',
      description: 'Free to download and use. Professional-grade tools without any cost.',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className={`container mx-auto px-4 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Workflows
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need for professional text processing and JSON manipulation, built with developers in mind.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer group"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to see all features in action?
          </p>
          <a
            href="/features"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Explore All Features →
          </a>
        </div>
      </div>
    </section>
  );
}
