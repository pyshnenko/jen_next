"use client";

import React, { useEffect, useState } from "react";
import axios, { type AxiosProgressEvent } from "axios";
import { useRouter } from "next/navigation";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Project {
  id: number,
  project_name: string,
  project_url: string,
  createdAt: Date,
  user_login: string
}

interface User {
  Id:number,
  access: number,
  exp:number,
  iat: number,
  lastname: string,
  login: string,
  name: string
}

const UserLevel = new Map(
  [[1, 'Абитуриент'], [5, 'Студент'], [10, 'Преподаватель'], [20, 'Администратор'], [100, 'Тоха']]
)

export default function ProfilePage() {
  const [user, setUser] = useState<User|null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        /*const testValue = axios.put('/api/updPermissions', {login: 'test', acc: 100});
        console.log(testValue)*/
        const res = await axios.get("/api/auth", { withCredentials: true });
        if (res.status === 200 && res.data?.authenticated) {
          setUser(res.data.user);
          if (res.data.user.access === 100) {
            updUserList();
          }
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
      setMyProjects(res.data.filter((proj: Project)=>proj.user_login === login));
      setProjects(res.data.filter((proj: Project)=>proj.user_login !== login))
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

  const updUserList = async () => {
    try {
      const usersRes = await axios.get("/api/users");
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.log("Failed to load users", err);
    }
  }

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

  const updAccess = async (event: SelectChangeEvent<number>, login: string) => {
    try {
      await axios.put('/api/updPermissions', {login, acc: event.target.value})
      updUserList();
    } catch (err) {}
  }

  const deleteProject = async (proj: Project) => {
    if (!user) return;
    if (!confirm(`Удалить проект "${proj.project_name}"?`)) return;
    try {
      setDeletingProjectId(proj.id);
      setStatus("Удаление проекта...");
      await axios.delete(`/api/projects/${proj.user_login}/${encodeURIComponent(proj.project_name)}`);
      setStatus(`Проект "${proj.project_name}" удалён`);
      await fetchProjects(user.login);
    } catch (err: any) {
      console.error("Delete project error", err);
      setStatus("Ошибка при удалении проекта: " + (err?.response?.data?.error || err?.message || ""));
    } finally {
      setDeletingProjectId(null);
    }
  };

  if (!user) return <Box sx={{ padding: 24 }}><Typography>Loading...</Typography></Box>;

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '100vh'}}>
      <Paper elevation={3} sx={{padding:2, width: '250px', margin: 8}}>
        <Typography variant="h5">{user.name} {user.lastname}</Typography>
        <Typography>Логин: {user.login}</Typography>
        <Typography>ID: {user.Id}</Typography>
        <Button variant="outlined" onClick={logout}>Выйти</Button>
      </Paper>

      {/* Форма загрузки ZIP */}
      <Paper elevation={3} component="form" onSubmit={upload} sx={{ margin: 8, padding: 2,mt: 3, display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 }}>
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
      </Paper>

      {/* Список проектов */}
      <Paper elevation={3} sx={{ mt: 4, padding: 2, width: '90%' }}>
        <Typography variant="h6">Ваши проекты</Typography>
        {loadingProjects ? (
          <Typography>Загружаем проекты...</Typography>
        ) : myProjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Пока нет загруженных проектов</Typography>
        ) : (
          <List>
            {myProjects.map((proj) => (
              <ListItem
                key={proj.id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteProject(proj)}
                    disabled={deletingProjectId === proj.id}
                    title="Удалить проект"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Link href={proj.project_url} target="_blank" rel="noopener">
                      {proj.project_name}
                    </Link>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        URL: <Link href={proj.project_url} target="_blank">{`${proj.project_url}`}</Link>
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
      </Paper>

      {projects.length > 0 && <Paper elevation={3} sx={{ mt: 4, padding: 2, width: '90%' }}>
        <Typography variant="h6">Проекты других пользователей</Typography>        
          <List>
            {projects.map((proj) => (
              <ListItem
                key={proj.id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteProject(proj)}
                    disabled={deletingProjectId === proj.id}
                    title="Удалить проект"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Link href={proj.project_url} target="_blank" rel="noopener">
                      {proj.user_login+': '+proj.project_name}
                    </Link>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        URL: <Link href={proj.project_url} target="_blank">{`${proj.project_url}`}</Link>
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
      </Paper>}
      {usersList.length > 0 && <Paper elevation={3} sx={{
        margin: 8,
        padding: 2,
      }}>
        <Typography variant="h6">Список пользователей</Typography>
        {usersList.map((user) => {return (          
              <ListItem
                key={user.Id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    //onClick={() => deleteProject(proj)}
                    //disabled={deletingProjectId === proj.id}
                    title="Удалить проект"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              margin: 1,
              padding: 1,
            }}>
              <Typography>{user.login} ({UserLevel.get(user.access)})</Typography>
              <Select
                value={user.access}
                onChange={(evt)=>{updAccess(evt, user.login)}}
              >
                {[1,5,10,20,100].map((item) => <MenuItem value={item}>{UserLevel.get(item)}</MenuItem>)}
              </Select>
              <Typography>{user.name} {user.lastname}</Typography>
            </Box>
          </ListItem>
        )})}
      </Paper>} 
    </Box>
  );
}
