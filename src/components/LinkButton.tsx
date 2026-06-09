"use client"
import React from "react";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import {SpeedDialIcon} from "@mui/material";
import Link from "next/link";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const actions = [
  {
    icon: <WhatsAppIcon />,
    href: 'https://wa.me/79957578746',
    tooltip: 'WhatsApp',
  },
  {
    icon: <TelegramIcon />,
    href: 'https://t.me/CodeGapSchool',
    tooltip: 'Telegram',
  },
  {
    icon: (
      <img
        src="/jen/vk_icon.svg"
        alt="VK"
        style={{ width: 24, height: 24, objectFit: 'contain' }}
      />
    ),
    href: 'https://vk.com/code_gap',
    tooltip: 'ВКонтакте',
  },
  {
    icon: <LocalPhoneIcon />,
    href: 'tel:+79957578746',
    tooltip: 'Позвонить',
  },
];

export default function LinkButton(): React.ReactNode {
  return (
    <SpeedDial
      ariaLabel="Контакты"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<LocalPhoneIcon />}
    >
      {actions.map((action) => (
          <SpeedDialAction
            key={action.href}
            tooltipTitle={action.tooltip}
            icon={action.icon}
            onClick={() => {
                if (action.href.startsWith('http') || action.href.startsWith('tel')) {
                window.open(action.href, '_blank', 'noreferrer');
                }
            }}
        />
      ))}
    </SpeedDial>
  );
}