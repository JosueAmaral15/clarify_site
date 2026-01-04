import { useState, useEffect } from 'react';
import contactService, { type ContactMessage, type PaginatedContacts } from '../services/contactService';

export default function AdminContacts() {
  const [data, setData] = useState<PaginatedContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const limit = 20;

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const result = await contactService.getContacts(page, limit, statusFilter);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await contactService.updateContactStatus(id, newStatus);
      fetchContacts(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactService.deleteContact(id);
      fetchContacts(); // Refresh list
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    read: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading messages...</div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {data?.contacts.map((contact: ContactMessage) => (
            <div
              key={contact._id}
              onClick={() => setSelectedMessage(contact)}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedMessage?._id === contact._id
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[contact.status]
                  }`}
                >
                  {contact.status}
                </span>
              </div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">
                {contact.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {contact.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                Page {page} of {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.pages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    statusColors[selectedMessage.status]
                  }`}
                >
                  {selectedMessage.status}
                </span>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t dark:border-gray-700 pt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Status:
                  </label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
                  >
                    📧 Reply via Email
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
