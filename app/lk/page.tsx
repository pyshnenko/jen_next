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
import { useAppDispatch } from "@/src/store/hooks";
import { setUser } from "@/src/store/userDataStore";

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
      {/* Ключевое изменение: рендерим контент только если вкладка активна */}
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function LK(): React.ReactElement {
  const [register, setRegister] = useState({ login: "", pass: "", name: "", lastname: "" });
  const [loginForm, setLoginForm] = useState({ login: "", pass: "" });
  const [message, setMessage] = useState<string>("");
  const [value, setValue] = useState(0);
  const router = useRouter();
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth", { withCredentials: true });
        if (res.status === 200 && res.data?.authenticated) {
          dispatch(setUser(res.data.user));
          router.push("/lk/profile");
        }
      } catch (e) {
        console.log("Not authenticated or error:", e);
      }
    })();
  }, [dispatch, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("/api/users", register);
      setMessage("Регистрация успешна");
      setRegister({ login: "", pass: "", name: "", lastname: "" });
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
    setMessage(""); // Сбрасываем сообщение при смене вкладки
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
      <Paper elevation={6} sx={{ width: 360, padding: 2 }}>
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

        <Box sx={{ position: 'relative', minHeight: 450, overflow: 'hidden' }}>
          
          {/* ФОРМА РЕГИСТРАЦИИ */}
          <TabPanel value={value} index={0}>
            <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
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
                  width: '85%',
                }}
              >
                <Typography variant="h6">Создать аккаунт</Typography>
                <TextField
                  label="Логин"
                  name="reg_login"
                  id="reg_login"
                  autoComplete="new-username"
                  value={register.login}
                  onChange={(e) => setRegister(prev => ({ ...prev, login: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Пароль"
                  type="password"
                  name="reg_password"
                  id="reg_password"
                  autoComplete="new-password"
                  value={register.pass}
                  onChange={(e) => setRegister(prev => ({ ...prev, pass: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Имя"
                  name="first_name"
                  value={register.name}
                  onChange={(e) => setRegister(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Фамилия"
                  name="last_name"
                  value={register.lastname}
                  onChange={(e) => setRegister(prev => ({ ...prev, lastname: e.target.value }))}
                  fullWidth
                />
                <Button type="submit" variant="contained" fullWidth>
                  Зарегистрироваться
                </Button>
                {message && <Typography color="primary" variant="body2" align="center">{message}</Typography>}
              </Paper>
            </Box>
          </TabPanel>

          {/* ФОРМА ВХОДА */}
          <TabPanel value={value} index={1}>
            <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
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
                  width: '85%',
                }}
              >
                <Typography variant="h6">Вход в аккаунт</Typography>
                <TextField
                  label="Логин"
                  name="l1"
                  id="l1"
                  autoComplete="username"
                  value={loginForm.login}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, login: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Пароль"
                  type="password"
                  name="password"
                  id="password_field"
                  autoComplete="current-password"
                  value={loginForm.pass}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, pass: e.target.value }))}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" fullWidth>
                  Войти
                </Button>
                {message && <Typography color="error" variant="body2" align="center">{message}</Typography>}
              </Paper>
            </Box>
          </TabPanel>

        </Box>
      </Paper>
    </Box>
  );
}
