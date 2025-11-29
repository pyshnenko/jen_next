"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

interface User {
  Id: number;
  login: string;
  hash: string;
  name: string;
  lastname: string;
  access: number;
  folder: string;
  project: string;
}

// Компонент для панели вкладки
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function LK(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [register, setRegister] = useState({ login: "", pass: "", name: "", lastname: "" });
  const [loginForm, setLoginForm] = useState({ login: "", pass: "" });
  const [message, setMessage] = useState<string>("");
  const [value, setValue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth", { withCredentials: true });
        if (res.status === 200 && res.data?.authenticated) {
          router.push("/lk/profile");
        }
      } catch (e) {
        // not authenticated
      }
    })();
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data || []);
    } catch (err) {
      // ignore
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/api/users", register);
      setMessage("Регистрация успешна");
      setRegister({ login: "", pass: "", name: "", lastname: "" });
      await refreshUsers();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка регистрации");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/api/auth", loginForm, { withCredentials: true });
      if (res.status === 200 && res.data?.success) {
        router.push("/lk/profile");
      } else {
        setMessage("Неверные учётные данные");
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка входа");
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  
return (
  <Box sx={{
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    boxSizing: 'border-box',
  }}>
    <Paper elevation={6} sx={{ width: 360, padding:2 }}>
      {/* Заголовки вкладок */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="Регистрация" />
        <Tab label="Вход" />
      </Tabs>

      {/* Контейнер с фиксированной высотой и анимацией */}
      <Box
        sx={{
          position: 'relative',
          height: 450, // фиксированная высота — подобрана под форму
          overflow: 'hidden',
        }}
      >
        <TabPanel value={value} index={0}>
          <Box sx={{display: "flex",justifyContent: "center", width: '100%', height:"100%"}}>
          <Paper
            elevation={9}
            component="form"
            onSubmit={handleRegister}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
              height: '100%',
              transition: 'opacity 0.3s ease-in-out',
              opacity: value === 0 ? 1 : 0,
              position: value === 0 ? 'relative' : 'absolute',
              width: '85%',
            }}
          >
            <Typography variant="h6">Создать аккаунт</Typography>
            <TextField
              label="Логин"
              value={register.login}
              onChange={(e) => setRegister({ ...register, login: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Пароль"
              type="password"
              value={register.pass}
              onChange={(e) => setRegister({ ...register, pass: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Имя"
              value={register.name}
              onChange={(e) => setRegister({ ...register, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Фамилия"
              value={register.lastname}
              onChange={(e) => setRegister({ ...register, lastname: e.target.value })}
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth>
              Зарегистрироваться
            </Button>
            <Typography color="text.secondary" variant="body2" align="center">
              {message && value === 0 ? message : ''}
            </Typography>
            </Paper>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{display: "flex",justifyContent: "center", width: '100%', height:"100%"}}>
            <Paper
              elevation={9}
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                height: '100%',
                transition: 'opacity 0.3s ease-in-out',
                opacity: value === 1 ? 1 : 0,
                position: value === 1 ? 'relative' : 'absolute',
                width: '85%',
              }}
            >
              <Typography variant="h6">Вход в аккаунт</Typography>
              <TextField
                label="Логин"
                value={loginForm.login}
                onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Пароль"
                type="password"
                value={loginForm.pass}
                onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth>
                Войти
              </Button>
              <Typography color="text.secondary" variant="body2" align="center">
                {message && value === 1 ? message : ''}
              </Typography>
            </Paper>
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  </Box>
);
}
