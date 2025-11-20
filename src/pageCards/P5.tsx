import React from "react";

interface Props {
    show: boolean;
}

export default function P2({show}:Props):React.ReactNode {
    return (
        <div id="page2" className={`page5${show?' show':''}`}>
    <div className="card">
      <h3>
        Не можете определиться с курсом?<br/>
Оставьте заявку, мы вам перезвоним
и поможем выбрать подходящий курс
      </h3>
      <button>Оставить заявку</button>
    </div>
  </div>
    )
}