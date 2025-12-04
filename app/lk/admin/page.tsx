"use client"
import React, {useState,useEffect} from "react";
import axios from "axios";
import { useAuth } from "@/src/hooks/useAuth";
import { Paper, Typography, ListItem, IconButton, Box, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { User } from "@/src/types/frontGlobalTypes";
import { useRouter } from "next/navigation";

const UserLevel = new Map(
  [[1, 'Абитуриент'], [5, 'Студент'], [10, 'Преподаватель'], [20, 'Администратор'], [100, 'Тоха']]
)

export default function Admin(): React.JSX.Element {
  const [usersList, setUsersList] = useState<User[]>([]);
  const router = useRouter();
  
    const {user, loading} = useAuth();

    useEffect(() => {
        if (!loading && user) {
            if (user.access < 10) {
                router.push("/lk");
            } else {
                updUserList();
            }
        }
    }, [user, loading]);
  
    const updUserList = async () => {
      try {
        const usersRes = await axios.get("/api/users");
        setUsersList(usersRes.data || []);
      } catch (err) {
        console.log("Failed to load users", err);
      }
    }

    const updAccess = async (event: SelectChangeEvent<number>, login: string) => {
        try {
            await axios.put('/api/updPermissions', {login, acc: event.target.value})
            updUserList();
        } catch (err) {}
    }
    return (
        <Paper elevation={3} sx={{
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
      </Paper>
    )
}