import { Box } from "@mui/material";
import React from "react";

interface CardProps {
    children: React.ReactNode;
}
export default function Card({children}: CardProps):React.ReactNode  {
    return (
        <Box className='card'>
            {children}
        </Box>
    )
}