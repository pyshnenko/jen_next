'use client'; // Обязательно — чтобы использовать useEffect и DOM API

import { useState, useEffect } from 'react';
import { ReactNode } from 'react';

interface Props {
    position: number,
    setPosition:(n: number) => void
}
export default function ScrollController({position, setPosition}: Props): ReactNode {

  useEffect(() => {
    const handleScroll = () => {
      setPosition(window.scrollY);
    };

    // Добавляем слушатель после рендера на клиенте
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Запускаем только один раз после монтирования

  return (
    <div />
  );
}
