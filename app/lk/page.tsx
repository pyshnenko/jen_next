"use client"

import { Box, Paper, Button, Typography, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
    login: String,
    hash: String,
    name: String,
    lastname: String,
    access: Number,
    folder: String,
    project: String,
    Id: Number
}
export default function LK():React.ReactNode {

    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<{login: string, pass: string, name: string, lastname: string}>({
        login: '',
        pass: '',
        name: '',
        lastname: ''
    });

    useEffect(()=>{
        axios.get('/api/users/').then((res)=>{
            setUsers(res.data);
        })
    }, []);
    return (
        <Box sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
        }}>
            <Paper sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding:1,
                margin:1,
                gap:4,
                }}>
                <Typography>Регистрация</Typography>
                <TextField value={newUser.login} onChange={(el)=>{
                    setNewUser({
                        ...newUser,
                        login: el.target.value
                    })
                }} label='Логин' />
                <TextField type="password" value={newUser.pass} onChange={(el)=>{
                    setNewUser({
                        ...newUser,
                        pass: el.target.value
                    })
                }} label='Пароль' />
                <TextField value={newUser.name} onChange={(el)=>{
                    setNewUser({
                        ...newUser,
                        name: el.target.value
                    })
                }} label='Имя' />
                <TextField value={newUser.lastname} onChange={(el)=>{
                    setNewUser({
                        ...newUser,
                        lastname: el.target.value
                    })
                }} label='Фамилия' />
                <Button onClick={()=>{
                    axios.post('/api/users/', newUser)
                }}>Создадим пользователя</Button>
            </Paper>
            <Paper>
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    padding: 1,
                    margin: 1,
                }}>{users.map((item: User, index: number)=>{return (
                    <Box key={`${item.login} ${index}`}>
                        <Typography>{item.login}</Typography>
                    </Box>)})}</Paper>
            </Paper>
        </Box>
    )
}