import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    show: boolean;
}

export default function P1({show}: Props):ReactNode {
    return (
          <div className={`page1${show?' show':''}`} id="page1">
    <div id="mobile_logo">
      <img src="/jen/logo.png" />
      <h1>&lt;CODE_GAP&gt;</h1>
    </div>
    <div className="left_page1">
      <div className="textBlock">
        <h2>
          Академия <br/> программирования
        </h2>
        <img id="marker" src="./jen/heart.png.webp" />
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
        <img src="/jen/microsoft.png" />
        <p>Сертифицировано<br/>Microsoft</p>
      </div>
      <img className="gamepad" src="/jen/Gamepad_better.png" />
    </div>
  </div>
    )
}