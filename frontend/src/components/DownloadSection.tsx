import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import downloadService, { type DownloadStats } from '../services/downloadService';

export default function DownloadSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'linux' | 'macos'>('windows');
  const [downloadStats, setDownloadStats] = useState<DownloadStats>({ 
    total: 0, 
    byPlatform: { windows: 0, macos: 0, linux: 0 }, 
    recent: [] 
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Fetch download stats
    downloadService.getDownloadStats()
      .then(stats => setDownloadStats(stats))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      icon: '🪟',
      version: 'v2.9.111',
      size: '45 MB',
      requirements: 'Windows 10/11 (64-bit)',
      downloadUrl: '#', // TODO: Add actual download URL
      installer: 'clarify-setup-2.9.111.exe',
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: '🐧',
      version: 'v2.9.111',
      size: '42 MB',
      requirements: 'Ubuntu 20.04+ / Debian 11+ (64-bit)',
      downloadUrl: '#', // TODO: Add actual download URL
      installer: 'clarify_2.9.111_amd64.deb',
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '🍎',
      version: 'v2.9.111',
      size: '48 MB',
      requirements: 'macOS 11 Big Sur or later',
      downloadUrl: '#', // TODO: Add actual download URL
      installer: 'clarify-2.9.111.dmg',
    },
  ];

  const currentPlatform = platforms.find(p => p.id === selectedPlatform)!;

  const installInstructions = {
    windows: [
      'Download the .exe installer',
      'Double-click to run the installer',
      'Follow the installation wizard',
      'Launch Clarify from Start Menu',
    ],
    linux: [
      'Download the .deb package',
      'Run: sudo dpkg -i clarify_2.9.111_amd64.deb',
      'Or double-click and use Software Center',
      'Launch from Applications menu',
    ],
    macos: [
      'Download the .dmg file',
      'Open the .dmg and drag Clarify to Applications',
      'Right-click and select "Open" (first time only)',
      'Launch from Applications folder',
    ],
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className={`container mx-auto px-4 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Download Clarify
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose your platform and start boosting your productivity today.
          </p>
          
          {/* Download Count Badge */}
          <div className="mt-6 inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-full">
            <span className="text-2xl mr-2">⬇️</span>
            <span className="font-semibold">{downloadStats.total.toLocaleString()}+ downloads</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Platform Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id as any)}
                className={`flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Download Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Download Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl">{currentPlatform.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentPlatform.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Version {currentPlatform.version}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    try {
                      // Track download
                      await downloadService.trackDownload({
                        platform: selectedPlatform,
                        version: currentPlatform.version,
                        source: 'website'
                      });
                      
                      // Get download link
                      const downloadUrl = await downloadService.getDownloadLink(selectedPlatform);
                      
                      // Initiate download
                      window.location.href = downloadUrl;
                      
                      // Update stats
                      const stats = await downloadService.getDownloadStats();
                      setDownloadStats(stats);
                    } catch (error) {
                      alert('Download temporarily unavailable. Please try again.');
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  className="block w-full bg-green-600 text-white text-center px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">{isDownloading ? '⏳' : '⬇️'}</span>
                  {isDownloading ? 'Preparing download...' : `Download for ${currentPlatform.name}`}
                </button>

                {/* File Info */}
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>📦 {currentPlatform.installer}</span>
                  <span>💾 {currentPlatform.size}</span>
                </div>

                {/* System Requirements */}
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    System Requirements
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentPlatform.requirements}
                  </p>
                </div>
              </div>

              {/* Right: Installation Instructions */}
              <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Installation Instructions
                </h4>
                <ol className="space-y-3">
                  {installInstructions[selectedPlatform].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                {/* Links */}
                <div className="mt-6 pt-4 border-t border-blue-200 dark:border-gray-700 space-y-2">
                  <a
                    href="/docs"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    📖 Full Documentation →
                  </a>
                  <a
                    href="#"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Release notes coming soon!');
                    }}
                  >
                    📝 Release Notes (v2.9.111) →
                  </a>
                  <a
                    href="https://github.com/JosueAmaral15/clarify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    🐙 View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="text-3xl mb-2">🆓</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Free Forever
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No hidden costs, no subscriptions.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="text-3xl mb-2">🔄</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Auto Updates
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified of new versions automatically.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="text-3xl mb-2">🛡️</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Safe & Secure
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verified and signed. No malware, no tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
