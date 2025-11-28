"use client";

import React, { useEffect, useState } from "react";
import axios, { type AxiosProgressEvent } from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  TextField,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
} from "@mui/material";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth", { withCredentials: true });
        if (res.status === 200 && res.data?.authenticated) {
          setUser(res.data.user);
          // Загружаем проекты
          await fetchProjects(res.data.user.login);
        } else {
          router.push("/lk");
        }
      } catch (_err) {
        router.push("/lk");
      }
    })();
  }, []);

  const fetchProjects = async (login: string) => {
    try {
      const res = await axios.get(`/api/projects/${login}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (_) { /* ignore */ }
    router.push("/lk");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && !selected.name.endsWith('.zip')) {
      setStatus('Можно загружать только ZIP-архивы');
      setFile(null);
    } else {
      setStatus('');
      setFile(selected);
    }
  };

  const upload = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus("");
    setProgress(null);

    if (!file || !projectName || !user?.login) {
      setStatus("Выберите ZIP-файл и укажите имя проекта");
      return;
    }

    try {
      setStatus("Загрузка и распаковка...");
      setProgress(0);
      const form = new FormData();
      form.append("login", user.login);
      form.append("projectName", projectName);
      form.append("file", file);

      const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_API_URL || "";
      const res = await axios.post(`${LOCAL_API}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const loaded = progressEvent?.loaded ?? 0;
          const total = progressEvent?.total ?? 0;
          if (total) {
            const pct = Math.round((loaded * 100) / total);
            setProgress(pct);
          }
        },
      });

      if (res.status === 201) {
        setStatus(`Проект "${projectName}" успешно загружен и распакован`);
        setProjectName("");
        setFile(null);
        // Обновляем список проектов
        await fetchProjects(user.login);
      } else {
        setStatus("Ошибка: " + (res.data?.error || res.statusText));
      }
    } catch (err: any) {
      setStatus("Ошибка: " + (err?.response?.data?.error || err.message));
    } finally {
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

      {/* Форма загрузки ZIP */}
      <Box component="form" onSubmit={upload} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 }}>
        <Typography variant="h6">Загрузить проект</Typography>
        <TextField
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          label="Имя проекта"
          required
          fullWidth
        />
        <Box>
          <input
            type="file"
            accept=".zip"
            onChange={onFileChange}
          />
          {file && (
            <Typography variant="body2" color="text.secondary">
              Выбран: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </Typography>
          )}
        </Box>

        {progress !== null && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{progress}%</Typography>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={progress !== null || !file || !projectName}
        >
          Загрузить ZIP
        </Button>
        <Typography variant="body2" color="text.secondary">{status}</Typography>
      </Box>

      {/* Список проектов */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Ваши проекты</Typography>
        {loadingProjects ? (
          <Typography>Загружаем проекты...</Typography>
        ) : projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Пока нет загруженных проектов</Typography>
        ) : (
          <List>
            {projects.map((proj) => (
              <ListItem key={proj.id} divider>
                <ListItemText
                  primary={
                    <Link href={proj.project_url} target="_blank" rel="noopener">
                      {proj.project_name}
                    </Link>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        URL: <Link href={proj.project_url+'index.html'} target="_blank">{`${proj.project_url}index.html`}</Link>
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        Создан: {new Date(proj.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={logout}>Выйти</Button>
      </Box>
    </Box>
  );
}
