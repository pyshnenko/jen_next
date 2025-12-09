import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar():React.ReactNode {
    return (
        <nav className="navbar">
            <div style={{
                display: 'inline-flex',
                alignItems: 'center'
            }}>
            <Link href='/'><Image width={60} height={60} src="/jen/logo.png" alt="Логотип" className="logo" id="topLogo"/></Link>
            <ul className="nav-links">
                <li><p id="about">О нас</p></li>
                <li><p id="courses">Курсы</p></li>
                <li><p id="team">Команда</p></li>
                <li><p id="contact">Контакты</p></li>
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