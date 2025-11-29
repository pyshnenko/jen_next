import { Box } from "@mui/material";
import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  show: boolean;
}

export default function P1({ show }: Props): ReactNode {
  console.log('render')
  return (
    <div className={`page1${show ? ' show' : ''}`} id="page1">
      <div id="mobile_logo">
        <img src="/jen/logo.png" alt="Logo" />
        <h1>&lt;CODE_GAP&gt;</h1>
      </div>

      <div className="left_page1">
        <div className="textBlock">
          <h2>
            Академия <br /> программирования
          </h2>
          <Link href="/lk" aria-label="Личный кабинет" style={{ display: 'inline-block', cursor: 'pointer' }}>
            <img alt="Marker" className="desctop" id="marker" src="./jen/heart.png.webp" />
          </Link>
          
          {/* Link without preventDefault — clicking image navigates to /lk on mobile */}
          <Link href="/lk" aria-label="Личный кабинет" style={{ display: 'inline-block', cursor: 'pointer' }}>
            <img
              style={{ cursor: 'pointer' }}
              alt="LK"
              className="mobile"
              id="marker"
              src="./jen/heartLK.png"
            />
          </Link>
        </div>
        <p>Для детей от 8 до 16 лет</p>
      </div>

      <div className="right_page1" style={{
        width: '55%',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <img
          src="/jen/centralImg.webp"
          alt="Центральное изображение"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <div>
        <div className="microsft">
          <img src="/jen/microsoft.png" alt="Microsoft" />
          <p>Сертифицировано<br />Microsoft</p>
        </div>
        <img className="gamepad" src="/jen/Gamepad_better.png" alt="Gamepad" />
      </div>
    </div>
  );
}
