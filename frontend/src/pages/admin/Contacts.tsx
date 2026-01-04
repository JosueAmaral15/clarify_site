import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, CircularProgress } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import api from '../../services/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
    try {
      await api.patch(`/contacts/${id}`, { status });
      fetchContacts();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return;
    
    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
      if (selectedContact?._id === id) {
        handleCloseDialog();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir contato');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'contacted':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'contacted':
        return 'Contatado';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
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
        Gerenciar Contatos
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Empresa</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum contato encontrado
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.company || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(contact.status)}
                      color={getStatusColor(contact.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewContact(contact)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteContact(contact._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Contato</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nome:</strong> {selectedContact.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {selectedContact.email}
              </Typography>
              {selectedContact.company && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Empresa:</strong> {selectedContact.company}
                </Typography>
              )}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Data:</strong> {new Date(selectedContact.createdAt).toLocaleString('pt-BR')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Status:</strong>
                <Chip
                  label={getStatusLabel(selectedContact.status)}
                  color={getStatusColor(selectedContact.status) as any}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                <strong>Mensagem:</strong>
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">{selectedContact.message}</Typography>
              </Paper>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Atualizar Status:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={selectedContact.status === 'pending' ? 'contained' : 'outlined'}
                    color="warning"
                    size="small"
                    onClick={() => handleUpdateStatus(selectedContact._id, 'pending')}
                  >
                    Pendente
                  </Button>
                  <Button
                    variant={selectedContact.status === 'contacted' ? 'contained' : 'outlined'}
                    color="info"
                    size="small"
                    onClick={() => handleUpdateStatus(selectedContact._id, 'contacted')}
                  >
                    Contatado
                  </Button>
                  <Button
                    variant={selectedContact.status === 'resolved' ? 'contained' : 'outlined'}
                    color="success"
                    size="small"
                    onClick={() => handleUpdateStatus(selectedContact._id, 'resolved')}
                  >
                    Resolvido
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;
