'use client';
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, IconButton, Box, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { VpnUser, VpnFormData } from '@/src/types/vpn';

export default function VpnManager() {
  const [users, setUsers] = useState<VpnUser[]>([]);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/vpn/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Не удалось загрузить список пользователей');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await fetch('/api/vpn/users');
        const data = await res.json();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (isMounted) setError('Ошибка загрузки');
      }
    };

    loadData();

    return () => { isMounted = false; }; // Чистка, чтобы не менять state удаленного компонента
  }, []);

  const handleAction = async (method: 'POST' | 'DELETE', body?: VpnFormData, query = '') => {
    setError(null);
    const res = await fetch(`/api/vpn/users${query}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) {
      fetchUsers();
      setForm({ username: '', password: '' });
    } else {
      const errData = await res.json();
      setError(errData.error || 'Ошибка сервера');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Управление VPN</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField 
          label="Логин" 
          size="small" 
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField 
          label="Пароль" 
          type="password" 
          size="small" 
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          onClick={() => handleAction('POST', form)}
          disabled={!form.username || !form.password}
        >
          Сохранить
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell><strong>Пользователь</strong></TableCell>
              <TableCell><strong>Группа</strong></TableCell>
              <TableCell align="right"><strong>Действия</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleAction('DELETE', undefined, `?username=${user.username}`)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
