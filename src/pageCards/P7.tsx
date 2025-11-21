import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  show: boolean;
}

export default function P7({ show }: Props): React.ReactElement {
  const [phone, setPhone] = useState<string>('+7');
  const [city, setCity] = useState<string>('');

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
    <div id="page7" className={`page2${show ? ' show' : ''}`}>
      <div className="card column">
        <h3>Запишись на первое бесплатное занятие</h3>
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