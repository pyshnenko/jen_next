import React from "react";

interface Props {
    show: boolean;
}

export default function P2({show}:Props):React.ReactNode {
    return (
        <div id="page4" className={`page2${show?' show':''}`}>
    <h3>Наши курсы</h3>
    <div className="card">
      <div className="carousel">
        <div className="carousel-item">
          <img src="./jen/minecraft.png" alt="Курс"/>
          <h5>Программирование в Minecraft</h5>
        </div>
        <div className="carousel-item">
          <img src="./jen/roblox.png" alt="Курс"/>
          <h5>Создание игр в Roblox</h5>
        </div>
        <div className="carousel-item">
          <img src="./jen/unity.png" alt="Курс"/>
          <h5>Разработка на Unity</h5>
        </div>
      </div>
      <div id="robot"></div>
    </div>
    <div></div>
  </div>
    )
}