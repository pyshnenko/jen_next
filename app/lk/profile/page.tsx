"use client";
import React, {useState, useEffect} from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { userExit, setUser } from "@/src/store/userDataStore";

export default function Project(): React.ReactNode {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
    const router = useRouter();
    
      useEffect(() => {
  if (user?.Id !== -1) return; // ← Если пользователь уже загружен — не делаем запрос

  const loadUser = async () => {
    try {
      const res = await axios.get("/api/auth", { withCredentials: true });
      if (res.status === 200 && res.data?.authenticated) {
        dispatch(setUser(res.data.user));
      } else {
        router.push("/lk");
      }
    } catch (err) {
      router.push("/lk");
    }
  };

  loadUser();
}, [user?.Id, dispatch, router]);


      const logout = async () => {
          try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
            dispatch(userExit())
          } catch (_) { /* ignore */ }
          router.push("/lk");
        };

    return (
        <>{user&&<Paper elevation={3} sx={{padding:2, width: '250px', margin: 8}}>
            <Typography variant="h5">{user.name} {user.lastname}</Typography>
            <Typography>Логин: {user.login}</Typography>
            <Typography>ID: {user.Id}</Typography>
            <Button variant="outlined" onClick={logout}>Выйти</Button>
        </Paper>}</>
    )
}