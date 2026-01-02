import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'DevOps Engineer',
      company: 'Tech Corp',
      content: 'Clarify has become an essential tool in my daily workflow. The JSON manipulation features alone save me hours every week!',
      avatar: '👩‍💻',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Software Developer',
      company: 'StartupXYZ',
      content: 'The AI integration is a game-changer. I can process and translate large JSON files in seconds. Absolutely love it!',
      avatar: '👨‍💻',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Data Analyst',
      company: 'DataCo',
      content: 'Best text processing tool I\'ve used. The multi-language support and plugin system make it incredibly versatile.',
      avatar: '👩‍🔬',
    },
    {
      id: 4,
      name: 'James Smith',
      role: 'Tech Lead',
      company: 'Enterprise Inc',
      content: '97% test coverage speaks volumes about quality. Our entire team uses Clarify for data processing tasks.',
      avatar: '👨‍💼',
    },
  ];

  const stats = [
    { label: 'GitHub Stars', value: '2,500+', icon: '⭐' },
    { label: 'Active Users', value: '10,000+', icon: '👥' },
    { label: 'Downloads', value: '50,000+', icon: '⬇️' },
    { label: 'Contributors', value: '25+', icon: '🤝' },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className={`container mx-auto px-4 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See what professionals are saying about Clarify and how it's transforming their workflow.
          </p>
        </div>

        {/* GitHub Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Quote Icon */}
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">"</div>
              
              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                {testimonial.content}
              </p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="text-4xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} @ {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Used by <span className="font-bold text-blue-600 dark:text-blue-400">10,000+ developers</span> from companies around the world
          </p>
        </div>
      </div>
    </section>
  );
}
