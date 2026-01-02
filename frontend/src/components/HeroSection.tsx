import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [stats, setStats] = useState({
    users: 0,
    downloads: 0,
    stars: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      users: 10000,
      downloads: 50000,
      stars: 2500,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        users: Math.floor(targets.users * progress),
        downloads: Math.floor(targets.downloads * progress),
        stars: Math.floor(targets.stars * progress),
      });

      if (currentStep >= steps) {
        setStats(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="text-sm font-medium">
                🎉 Version 2.9.111 - Latest Release
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Clarify - Your Professional{' '}
              <span className="text-yellow-300">Text Processing</span> Toolkit
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              15+ powerful tools, AI integration with OpenAI & Gemini, 7 languages support, 
              and 97% test coverage. Transform your text processing workflow today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/download"
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                <span className="mr-2">⬇️</span>
                Download for Free
              </Link>
              
              <Link
                to="/features"
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 text-center"
              >
                <span className="mr-2">🚀</span>
                Explore Features
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-sm text-blue-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stats.downloads.toLocaleString()}+
                </div>
                <div className="text-sm text-blue-200">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stats.stars.toLocaleString()}+
                </div>
                <div className="text-sm text-blue-200">GitHub Stars</div>
              </div>
            </div>
          </div>

          {/* Right: Screenshot/Visual */}
          <div className="relative">
            {/* Main Screenshot Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              {/* Mock Window Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              {/* Mock Screenshot Content */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 text-center">
                <div className="text-8xl mb-4">🛠️</div>
                <div className="text-white font-mono text-sm mb-2">
                  $ clarify --version
                </div>
                <div className="text-green-400 font-mono text-xs mb-4">
                  Clarify v2.9.111
                </div>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded px-3 py-2 text-left text-white text-xs">
                    <span className="text-blue-400">→</span> JSON Translate
                  </div>
                  <div className="bg-white/10 rounded px-3 py-2 text-left text-white text-xs">
                    <span className="text-green-400">→</span> Search & Replace
                  </div>
                  <div className="bg-white/10 rounded px-3 py-2 text-left text-white text-xs">
                    <span className="text-purple-400">→</span> File Explorer
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                Free & Open Source
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-float">
              <div className="text-3xl">🤖</div>
              <div className="text-xs text-white font-medium mt-1">AI Powered</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-float-delayed">
              <div className="text-3xl">🌍</div>
              <div className="text-xs text-white font-medium mt-1">7 Languages</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>97% Test Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <span>Plugin System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>High Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💻</span>
              <span>Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🆓</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}
