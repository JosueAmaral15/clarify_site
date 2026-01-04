import { useState, useEffect } from 'react';
import downloadService, { type DownloadStats } from '../services/downloadService';

export default function AdminDownloads() {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await downloadService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch download statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const platformColors: Record<string, string> = {
    windows: 'bg-blue-500',
    linux: 'bg-yellow-500',
    macos: 'bg-gray-500',
  };

  const platformIcons: Record<string, string> = {
    windows: '🪟',
    linux: '🐧',
    macos: '🍎',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Download Statistics</h1>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Total Downloads Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Downloads</p>
            <p className="text-4xl font-bold mt-2">{stats?.total.toLocaleString()}</p>
          </div>
          <div className="text-6xl opacity-20">📥</div>
        </div>
      </div>

      {/* Downloads by Platform */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Downloads by Platform
        </h2>
        
        <div className="space-y-4">
          {Object.entries(stats?.byPlatform || {}).map(([platform, count]) => {
            const percentage = stats?.total ? ((count / stats.total) * 100).toFixed(1) : '0';
            
            return (
              <div key={platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{platformIcons[platform]}</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {platform}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${platformColors[platform]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(stats?.byPlatform || {}).map(([platform, count]) => (
          <div
            key={platform}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4"
            style={{
              borderLeftColor: platformColors[platform]?.replace('bg-', '#'),
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium capitalize">
                  {platform}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {count.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">{platformIcons[platform]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Export Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export download statistics to CSV for further analysis.
        </p>
        <button
          onClick={() => alert('CSV export feature coming soon!')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          📊 Export to CSV
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ℹ️ <strong>Note:</strong> Statistics are updated in real-time. Download data is collected
          from the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/api/downloads</code> endpoint.
        </p>
      </div>
    </div>
  );
}
