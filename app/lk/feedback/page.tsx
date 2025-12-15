import React from "react";
import { Box, Button, Typography, Paper, TextField } from "@mui/material";

export default function Page():React.ReactNode {
    return (
        <Box p={{xs: 2, sm:8}} pt={{xs:'68px',sm:'68px'}} >
                <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: {xs: 2, sm: 8},
                gap:4
            }}>
                <Typography variant="h1" fontSize={'x-large'} textAlign={'center'}>Форма обратной связи</Typography>
                <Typography variant="h2" fontSize={'large'}>Введи свой вопрос</Typography>
                <TextField multiline rows={8} />
                <Button variant="outlined">Отправить</Button>
            </Paper>
        </Box>
    )
}