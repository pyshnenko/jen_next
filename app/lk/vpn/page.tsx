'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, IconButton, Alert, Stack, 
  Box, CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, InputAdornment 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { VpnUser, VpnFormData, HttpMethod } from '@/src/types/vpn';

export default function VpnPage() {
  const [users, setUsers] = useState<VpnUser[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // Состояние поиска
  const [form, setForm] = useState<VpnFormData>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addConfirm, setAddConfirm] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vpn/users');
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleAction = async (method: HttpMethod, body?: VpnFormData, query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vpn/users${query}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.ok) {
        await fetchUsers();
        setForm({ username: '', password: '' });
      } else {
        const errData = await res.json();
        setError(errData.error || 'Произошла ошибка');
        setLoading(false);
      }
    } catch (e) {
      setError('Сетевая ошибка');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: '150px', pb: 4 }}>
      {/* Заголовок */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
          Управление VPN
        </Typography>
        <IconButton onClick={fetchUsers} disabled={loading} color="primary" sx={{backgroundColor: 'white'}}>
          <RefreshIcon />
        </IconButton>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Верхняя форма (как на скриншоте) */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField 
            label="Логин" 
            fullWidth
            size="small" 
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
          />
          <TextField 
            label="Пароль" 
            type="password" 
            fullWidth
            size="small" 
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => setAddConfirm(true)}
            disabled={loading || !form.username || !form.password}
            sx={{ minWidth: '180px', textTransform: 'none', fontWeight: 'bold' }}
          >
            СОХРАНИТЬ
          </Button>
        </Stack>
      </Paper>

      {/* Основная рабочая область: Поиск слева, Таблица справа */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        
        {/* Панель поиска слева */}
        <Box sx={{ width: { xs: '100%', md: '250px' }, position: { md: 'sticky' }, top: '170px' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            ПОИСК ПОЛЬЗОВАТЕЛЯ
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Введите имя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          {searchQuery && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
              Найдено: {filteredUsers.length}
            </Typography>
          )}
        </Box>

        {/* Таблица справа */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Имя пользователя</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.username} hover>
                    <TableCell sx={{ fontSize: '0.95rem' }}>{user.username}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        color="error" 
                        disabled={loading}
                        onClick={() => setDeleteConfirm(user.username)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      {searchQuery ? 'Ничего не найдено' : 'Список пользователей пуст'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {loading && <Box sx={{ width: '100%', textAlign: 'center', p: 2 }}><CircularProgress size={24} /></Box>}
          </TableContainer>
        </Box>
      </Stack>

      {/* Диалоги подтверждения (без изменений) */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Доступ для <b>{deleteConfirm}</b> будет аннулирован на всех серверах.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={() => {
            handleAction('DELETE', undefined, `?username=${deleteConfirm}`);
            setDeleteConfirm(null);
          }}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addConfirm} onClose={() => setAddConfirm(false)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Обновить данные пользователя <b>{form.username}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddConfirm(false)}>Отмена</Button>
          <Button color="primary" variant="contained" onClick={() => {
            handleAction('POST', form);
            setAddConfirm(false);
          }}>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
