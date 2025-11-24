"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";

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

export default function LK(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [register, setRegister] = useState({ login: "", pass: "", name: "", lastname: "" });
  const [loginForm, setLoginForm] = useState({ login: "", pass: "" });
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // if already authenticated — go to profile immediately
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
      // отправляем login + pass + name + lastname -> сервер (app/api/users) хеширует и сохраняет
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
        // redirect to profile — cookie already set by server
        router.push("/lk/profile");
      } else {
        setMessage("Неверные учётные данные");
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      gap: 4,
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 4,
      boxSizing: 'border-box'
    }}>
      <Box component="form" onSubmit={handleRegister} sx={{ width: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Регистрация</Typography>
        <TextField label="Логин" value={register.login} onChange={e => setRegister({ ...register, login: e.target.value })} required />
        <TextField label="Пароль" type="password" value={register.pass} onChange={e => setRegister({ ...register, pass: e.target.value })} required />
        <TextField label="Имя" value={register.name} onChange={e => setRegister({ ...register, name: e.target.value })} />
        <TextField label="Фамилия" value={register.lastname} onChange={e => setRegister({ ...register, lastname: e.target.value })} />
        <Button type="submit" variant="contained">Зарегистрироваться</Button>
      </Box>

      <Box component="form" onSubmit={handleLogin} sx={{ width: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Вход</Typography>
        <TextField label="Логин" value={loginForm.login} onChange={e => setLoginForm({ ...loginForm, login: e.target.value })} required />
        <TextField label="Пароль" type="password" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} required />
        <Button type="submit" variant="contained">Войти</Button>
        <Typography color="text.secondary" variant="body2">{message}</Typography>
      </Box>

      <Box sx={{ maxWidth: 480 }}>
        <Typography variant="h6">Пользователи (для отладки)</Typography>
        {users.map(u => (
          <Box key={u.Id} sx={{ padding: 1, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle2">{u.login} ({u.name} {u.lastname})</Typography>
            <Typography variant="caption">Id: {u.Id} access: {u.access}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}