'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cardTargets: Record<string, number> = {
  about: 1,
  courses: 3,
  team: 5,
  contact: 8,
};

export default function NavBar(): React.ReactNode {
  const scrollToCard = useCallback((targetIndex: number) => {
    if (typeof window === 'undefined') return;
    const vh = window.innerHeight || 800;
    window.scrollTo({ top: targetIndex * vh, behavior: 'smooth' });
  }, []);

  return (
        <nav className="navbar">
            <div style={{
                display: 'inline-flex',
                alignItems: 'center'
            }}>
            <Link href='/'><Image width={60} height={60} src="/jen/logo.png" alt="Логотип" className="logo" id="topLogo"/></Link>
            <ul className="nav-links">
                <li><p id="about" onClick={() => scrollToCard(cardTargets.about)} style={{ cursor: 'pointer' }}>О нас</p></li>
                <li><p id="courses" onClick={() => scrollToCard(cardTargets.courses)} style={{ cursor: 'pointer' }}>Курсы</p></li>
                <li><p id="team" onClick={() => scrollToCard(cardTargets.team)} style={{ cursor: 'pointer' }}>Команда</p></li>
                <li><p id="contact" onClick={() => scrollToCard(cardTargets.contact)} style={{ cursor: 'pointer' }}>Контакты</p></li>
                <li><a href='/lk'><p>Кабинет</p></a></li>
            </ul>
            </div>
            <a href="tel:+79957578746"><button className="phoneButton">
                <p style={{
                    margin: '12px'
                }}>+7 995 757 87 46</p>
                </button>
            </a>
        </nav>
    )
}