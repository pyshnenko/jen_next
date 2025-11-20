import React from 'react';

interface Props {
    show: boolean;
}

export default function P2({show}:Props):React.ReactNode {
    return (
        <div id="page2" className={`page7${show?' show':''}`}>
    <div className="card">
      <h3>
        Наша команда
      </h3>      
      <div className="card">
        <div className="carousel">
          <div className="carousel-item revertable" data-back="Евгений работает в области разработки игр уже более 9 лет, а преподает разработку игр для детей более 7-ти лет. Он обожает Unity и язык программирования C#. В методические материалы он вложил всю свою душу и любовь к программированию.">
            <img src="./jen/evgen.jpg" />
            <h5>Евгений</h5>
            <p>
              Основатель, Unity разработчик, Создатель методических материалов<br/>Выпускник МГТУ им. Н.Э. Баумана
            </p>
          </div>
          <div className="carousel-item revertable" data-back="Мартин является Fullstack и Python разработчиком более 7 лет.<br>Опыт преподавания детям 5 лет.<br>Язык программирования Python - его страсть, именно поэтому наш курс программирования на этом языке разработан Мартином. Также в нашей команде он отвечает за SMM и наши соц. сети.">
            <img src="./jen/martin.jpg" />
            <h5>Мартин</h5>
            <p>Основатель, Web разработчик, Работа над соц. сетями<br/>Выпускник МГУ им. М.В. Ломоносова</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}