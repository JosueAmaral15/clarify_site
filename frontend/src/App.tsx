import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import DownloadPage from './pages/DownloadPage';
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsers from './pages/AdminUsers';
import AdminDownloads from './pages/AdminDownloads';
import AdminContacts from './pages/AdminContacts';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Contacts from './pages/admin/Contacts';
import Downloads from './pages/admin/Downloads';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'features',
        element: <FeaturesPage />,
      },
      {
        path: 'download',
        element: <DownloadPage />,
      },
      {
        path: 'docs',
        element: <DocsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage />,
      },
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      {
        path: 'admin/dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'admin/contacts',
        element: (
          <ProtectedRoute requireAdmin>
            <Contacts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/downloads',
        element: (
          <ProtectedRoute requireAdmin>
            <Downloads />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'downloads',
            element: <div className="p-6"><p>My Downloads - Coming Soon</p></div>,
          },
          {
            path: 'settings',
            element: <div className="p-6"><p>Settings - Coming Soon</p></div>,
          },
          {
            path: 'admin/users',
            element: <AdminUsers />,
          },
          {
            path: 'admin/downloads',
            element: <AdminDownloads />,
          },
          {
            path: 'admin/contacts',
            element: <AdminContacts />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
