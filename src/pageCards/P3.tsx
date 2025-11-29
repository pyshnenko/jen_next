import React from 'react';

interface Props {
    show: boolean;
}

export default function P2({show}:Props):React.ReactNode {
    return (
        <div id="page3" className={`page2${show?' show':''}`}>
    <div className="card">
      <h3>Наши приоритеты</h3>
      <div className="priory">
        <div className="carousel">
          <div className="carousel-item">
            <img className="levitate" src="./jen/guy-programming.png" />
            <h5>Преподаватели, которые вдохновляют</h5>
            <p>
              Их любовь и знание предмета мотивируют учеников покорять новые вершины
            </p>
          </div>
          <div className="carousel-item">
            <img className="levitate" src="./jen/smartboy.png" />
            <h5>Обучение практическим навыкам</h5>
            <p>
              Наши курсы основаны на современных британских курсах по разработке игр от gamedev.tv
            </p>
          </div>
          <div className="carousel-item">
            <img className="levitate" src="./jen/Group.png" />
            <h5>Работа в мини-группах или индивидуально</h5>
            <p>
              Мы работаем только в мини-группах до 8 учеников, чтобы уделить внимание каждому
            </p>
          </div>
          <div className="carousel-item">
            <img className="levitate" src="./jen/camera.png" />
            <h5>Видеоуроки для закрепления материала</h5>
            <p>
              После каждого занятия мы высылаем видеоуроки с пройденным материалом и ДЗ
              </p>
          </div>
        </div>
      </div>
      <button>Подробнее</button>
    </div>
  </div>
    )
}