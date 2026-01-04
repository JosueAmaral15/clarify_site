import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box, Chip } from '@mui/material';
import { Download } from '@mui/icons-material';
import api from '../../services/api';

interface DownloadRecord {
  _id: string;
  version: string;
  os: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

const Downloads: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/downloads');
      const data = response.data;
      setDownloads(data);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const todayCount = data.filter((d: DownloadRecord) => new Date(d.createdAt) >= today).length;
      const weekCount = data.filter((d: DownloadRecord) => new Date(d.createdAt) >= weekAgo).length;
      
      setStats({
        total: data.length,
        today: todayCount,
        thisWeek: weekCount
      });
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar downloads');
    } finally {
      setLoading(false);
    }
  };

  const getOsIcon = (os: string) => {
    return os.toLowerCase().includes('windows') ? '🪟' :
           os.toLowerCase().includes('mac') ? '🍎' :
           os.toLowerCase().includes('linux') ? '🐧' : '💻';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Download sx={{ mr: 1, verticalAlign: 'middle' }} />
        Gerenciar Downloads
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="primary">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total de Downloads
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="success.main">
            {stats.today}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hoje
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="info.main">
            {stats.thisWeek}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Últimos 7 dias
          </Typography>
        </Paper>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>SO</strong></TableCell>
              <TableCell><strong>Versão</strong></TableCell>
              <TableCell><strong>Data/Hora</strong></TableCell>
              <TableCell><strong>IP</strong></TableCell>
              <TableCell><strong>User Agent</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {downloads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum download registrado
                </TableCell>
              </TableRow>
            ) : (
              downloads.map((download) => (
                <TableRow key={download._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getOsIcon(download.os)}</span>
                      <Chip label={download.os} size="small" />
                    </Box>
                  </TableCell>
                  <TableCell>{download.version}</TableCell>
                  <TableCell>
                    {new Date(download.createdAt).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {download.ipAddress || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {download.userAgent || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Downloads;
