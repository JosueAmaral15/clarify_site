import { useState } from 'react';
import { FaWindows, FaLinux, FaApple, FaDownload, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

interface DownloadOption {
  id: string;
  platform: string;
  icon: typeof FaWindows;
  version: string;
  size: string;
  downloadUrl: string;
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const downloads: DownloadOption[] = [
    {
      id: 'windows',
      platform: 'Windows',
      icon: FaWindows,
      version: '1.0.0',
      size: '45 MB',
      downloadUrl: '/downloads/clarify-windows-1.0.0.exe'
    },
    {
      id: 'macos',
      platform: 'macOS',
      icon: FaApple,
      version: '1.0.0',
      size: '52 MB',
      downloadUrl: '/downloads/clarify-macos-1.0.0.dmg'
    },
    {
      id: 'linux',
      platform: 'Linux',
      icon: FaLinux,
      version: '1.0.0',
      size: '48 MB',
      downloadUrl: '/downloads/clarify-linux-1.0.0.AppImage'
    }
  ];

  const handleDownload = async (option: DownloadOption) => {
    setDownloading(option.id);
    
    try {
      // Track download
      await api.trackDownload({
        platform: option.platform,
        version: option.version
      });

      // Simulate download (in production, this would trigger actual file download)
      setTimeout(() => {
        setDownloading(null);
        setDownloaded([...downloaded, option.id]);
        
        // In production, trigger actual download
        // window.location.href = option.downloadUrl;
        alert(`Download started for ${option.platform}!\n\nIn production, this would download: ${option.downloadUrl}`);
      }, 1500);

    } catch (error) {
      console.error('Download tracking failed:', error);
      setDownloading(null);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="section-padding max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Download Clarify
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose your platform and start simplifying your text processing workflow today.
          Clarify is completely free and open source.
        </p>
      </div>

      {/* Download Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {downloads.map((option) => {
          const Icon = option.icon;
          const isDownloading = downloading === option.id;
          const isDownloaded = downloaded.includes(option.id);

          return (
            <div
              key={option.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="text-center">
                <Icon className="text-6xl text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {option.platform}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Version {option.version}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  Size: {option.size}
                </p>

                <button
                  onClick={() => handleDownload(option)}
                  disabled={isDownloading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
                    isDownloaded
                      ? 'bg-green-600 text-white cursor-default'
                      : isDownloading
                      ? 'bg-gray-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <FaCheckCircle />
                      Downloaded
                    </>
                  ) : isDownloading ? (
                    'Downloading...'
                  ) : (
                    <>
                      <FaDownload />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Requirements */}
      <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          System Requirements
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaWindows className="text-blue-600" />
              Windows
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Windows 10 or later</li>
              <li>• 64-bit processor</li>
              <li>• 4 GB RAM minimum</li>
              <li>• 100 MB disk space</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaApple className="text-blue-600" />
              macOS
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• macOS 10.15 or later</li>
              <li>• Intel or Apple Silicon</li>
              <li>• 4 GB RAM minimum</li>
              <li>• 100 MB disk space</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaLinux className="text-blue-600" />
              Linux
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Ubuntu 18.04 or later</li>
              <li>• 64-bit processor</li>
              <li>• 4 GB RAM minimum</li>
              <li>• 100 MB disk space</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Installation Instructions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Windows
            </h3>
            <ol className="text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Download the .exe installer</li>
              <li>Run the installer and follow the setup wizard</li>
              <li>Launch Clarify from the Start menu</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              macOS
            </h3>
            <ol className="text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Download the .dmg file</li>
              <li>Open the .dmg and drag Clarify to Applications</li>
              <li>Launch Clarify from Applications folder</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Linux
            </h3>
            <ol className="text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Download the .AppImage file</li>
              <li>Make it executable: chmod +x clarify-linux-1.0.0.AppImage</li>
              <li>Run the AppImage file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
