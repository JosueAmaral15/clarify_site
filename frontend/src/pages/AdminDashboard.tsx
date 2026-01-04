import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Stats {
  downloads: { total: number; thisMonth: number };
  contacts: { total: number; thisMonth: number };
  newsletter: { total: number; thisMonth: number };
}

interface Download {
  _id: string;
  email: string;
  platform: string;
  version: string;
  downloadedAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [platformStats, setPlatformStats] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, downloadsRes, contactsRes, platformRes, timelineRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/stats`, { headers }),
        axios.get(`${API_URL}/api/analytics/downloads`, { headers }),
        axios.get(`${API_URL}/api/analytics/contacts`, { headers }),
        axios.get(`${API_URL}/api/analytics/downloads/by-platform`, { headers }),
        axios.get(`${API_URL}/api/analytics/downloads/timeline`, { headers })
      ]);

      setStats(statsRes.data.data);
      setDownloads(downloadsRes.data.data);
      setContacts(contactsRes.data.data);
      setPlatformStats(platformRes.data.data);
      setTimeline(timelineRes.data.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin - Clarify</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Downloads</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.downloads.total}</p>
            <p className="text-sm text-green-600 mt-1">+{stats?.downloads.thisMonth} este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Contatos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.contacts.total}</p>
            <p className="text-sm text-green-600 mt-1">+{stats?.contacts.thisMonth} este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Newsletter</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.newsletter.total}</p>
            <p className="text-sm text-green-600 mt-1">+{stats?.newsletter.thisMonth} este mês</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Downloads - Últimos 30 Dias</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0088FE" name="Downloads" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Downloads por Plataforma</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {platformStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Downloads Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Downloads Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versão</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {downloads.slice(0, 10).map((download) => (
                  <tr key={download._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{download.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{download.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{download.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(download.downloadedAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Contacts Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Contatos Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.slice(0, 10).map((contact) => (
                  <tr key={contact._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.email}</td>
                    <td className="px-6 py-4 text-sm">{contact.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(contact.submittedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {contact.status === 'pending' ? 'Pendente' : 'Respondido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
