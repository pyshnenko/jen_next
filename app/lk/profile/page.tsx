"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, TextField, LinearProgress } from "@mui/material";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth", { withCredentials: true });
        if (res.status === 200 && res.data?.authenticated) {
          setUser(res.data.user);
        } else {
          router.push("/lk");
        }
      } catch (_err) {
        router.push("/lk");
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (_) { /* ignore */ }
    router.push("/lk");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const upload = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus('');
    setProgress(null);

    if (!file || !projectName || !user?.login) {
      setStatus('Укажите файл и имя проекта');
      return;
    }

    try {
      setStatus('Uploading...');
      setProgress(0);
      const form = new FormData();
      form.append('login', user.login);
      form.append('projectName', projectName);
      form.append('file', file);

      const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:4001';
      const res = await axios.post(`${LOCAL_API}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(pct);
          }
        },
      });

      if (res.status === 201) {
        setStatus('Загрузка успешна: ' + (res.data.path || res.data.filename));
        setProjectName('');
        setFile(null);
      } else {
        setStatus('Ошибка: ' + (res.data?.error || res.statusText));
      }
    } catch (err: any) {
      setStatus('Upload error: ' + (err?.response?.data?.error || err.message));
    } finally {
      // небольшая задержка, чтобы пользователь увидел 100%
      if (progress === 100) {
        setTimeout(() => setProgress(null), 600);
      } else {
        setProgress(null);
      }
    }
  };

  if (!user) return <Box sx={{ padding: 24 }}><Typography>Loading...</Typography></Box>;

  return (
    <Box sx={{ padding: 24 }}>
      <Typography variant="h5">Профиль</Typography>
      <Typography>Логин: {user.login}</Typography>
      <Typography>ID: {user.Id}</Typography>

      <Box component="form" onSubmit={upload} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
        <TextField value={projectName} onChange={(e) => setProjectName(e.target.value)} label="Project name" required />
        <input type="file" onChange={onFileChange} />
        {progress !== null && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>{progress}%</Typography>
          </Box>
        )}
        <Button type="submit" variant="contained" disabled={progress !== null}>Загрузить файл</Button>
        <Typography variant="body2" color="text.secondary">{status}</Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={logout}>Выйти</Button>
      </Box>
    </Box>
  );
}