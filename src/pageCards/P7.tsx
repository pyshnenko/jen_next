"use client"
import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface Props {
  show: boolean;
  closeButton?: boolean;
  autoOpenDelay?: number;
  noCard?: boolean;
}

export default function P7({ show, closeButton, autoOpenDelay, noCard }: Props): React.ReactElement {
  const [innerShow, setInnerShow] = useState<boolean>(show) // [1
  const [phone, setPhone] = useState<string>('+7');
  const [city, setCity] = useState<string>('');

  useEffect(() => {
    // Устанавливаем таймер на открытие
    const timer = setTimeout(() => {
      setInnerShow(autoOpenDelay ? true : show);
    }, autoOpenDelay);

    // Очищаем таймер, если компонент размонтирован
    return () => clearTimeout(timer);
  }, [autoOpenDelay]);
  
  useEffect(() => {
    if (!autoOpenDelay) setInnerShow(show); // [1]
  }, [show]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, '');
    // гарантия, что начинается с 7 (код РФ)
    if (!value.startsWith('7')) value = '7' + value;
    let formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.substring(1, 4);
    if (value.length >= 4) formatted += ') ' + value.substring(4, 7);
    if (value.length >= 7) formatted += '-' + value.substring(7, 9);
    if (value.length >= 9) formatted += '-' + value.substring(9, 11);
    setPhone(formatted.substring(0, 18));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone, city
        }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Ошибка при отправке:', error);
    }
  };

  return (
    <div id="page7" className={`${noCard ? '' : 'page2'}${innerShow ? ' show' : ''}`} style={noCard?{
      height: '100dvh',
      alignItems: 'center',
      backgroundImage: 'url(/jen/1.jpg)'
      }:{}}>
        {noCard&&<Box sx={{position: 'absolute', width: '100%', height: '100dvh', 
        backgroundImage: '-webkit-linear-gradient(top, rgba(74, 173, 28, 0.4), rgba(26, 26, 26, 0.7))'}}></Box>}
      {closeButton && <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => setInnerShow(false)}>
        <CloseIcon />
      </IconButton>}
      <div className="card column" style={{alignItems: 'center'}}>
        <h3 style={noCard?{color: 'white', 
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'}:{}}>Запишись на первое бесплатное занятие</h3>
        <form id="studentForm" className="form" method="post">
          <input
            type="tel"
            id="phoneInput"
            placeholder="+7 (___) ___-__-__"
            maxLength={18}
            required
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
          />
          <select value={city} id="courseDropdown" required name="city" onChange={(e) => setCity(e.target.value)}>
            <option value="" disabled>Выберите город</option>
            <option value="Наро-Фоминск">Наро-Фоминск</option>
            <option value="Обнинск">Обнинск</option>
            <option value="Селятино">Селятино</option>
          </select>
          <button type="submit" id="submitBtn" onClick={handleSubmit}>Оставить заявку</button>
        </form>
      </div>
    </div>
  );
}