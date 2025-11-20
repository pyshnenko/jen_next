import Card from "../helpers/Card";
import React from "react";
import '@/public/jen/pacman.css';
import '@/public/jen/packmanMobile.css';

interface Props {
    show: boolean;
}
export default function P2({show}:Props):React.ReactNode {
    return (
        <div id="page2" className={`page2${show?' show':''}`}>
            <div className="card">
            <div className="textBlock">
                <div className="pageHeadDiv">
                    <img src="/jen/code2.png" />
                    <h3>Кто нас вдохновляет<br/> и почему мы делаем игры?</h3>
                    <img id="rocket" src="./jen/rocket_2.png.webp" />
                </div>
                <p>
                    Основатели крупнейших IT компаний (Билл Гейтс, Марк Цукерберг и др.) начинали свой путь именно с игровой разработки.
                </p>
                <p>Создание игр - это увлекательный и творческий процесс, который развивает навыки решения сложных задач и логическое мышление. Каждый игровой проект заставляет продумывать новые механики, алгоритмы и пути решения проблем. Это лучшее направление для знакомства вашего ребенка с программированием!</p>
            </div>
            <div className="pacman">
                <div className="pacman-top"></div>
                <div className="pacman-bottom"></div>
                <div className="feed"></div>
            </div>
            </div>
            </div>
    )
}