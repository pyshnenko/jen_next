'use client';

import { useState, useRef, useEffect } from 'react';
import P1 from '../pageCards/P1';
import P2 from '../pageCards/P2';
import P3 from '../pageCards/P3';
import P4 from '../pageCards/P4';
import P5 from '../pageCards/P5';
import P6 from '../pageCards/P6';
import P7 from '../pageCards/P7';
import P8 from '../pageCards/P8';
import P9 from '../pageCards/P9';
import { Box } from '@mui/material';
import Card from '../helpers/Card';

const components = [P1, P2, P3, P4, P5, P6, P7, P8, P9];

const page2ShowStart   = 100;   // page2 появляется
const page2FadeInEnd   = 200;   // page2 полностью виден
const page2HideStart   = 550;   // page2 начинает исчезать
const page2FadeOutEnd  = 650;   // page2 исчезает

const page3ShowStart   = 600;   // page3 начинает появляться (перекрытие 50px)
const page3FadeInEnd   = 700;   // page3 полностью виден
const page3HideStart   = 1200;  // page3 начинает исчезать
const page3FadeOutEnd  = 1300;  // page3 исчезает

const page4ShowStart   = 1250;  // page4 появляется (начинается до конца page3)
const page4FadeInEnd   = 1350;  // page4 полностью виден

const page5ShowStart   = 1700;  // page5 начинает появляться
const page5FadeInEnd   = 1750;  // page5 полностью виден

const page6ShowStart   = 2000;  // page6 начинает появляться
const page6FadeInEnd   = 2100;  // page6 полностью виден

const page7ShowStart   = 2300;  // page7 начинает появляться
const page7FadeInEnd   = 2400;  // page7 полностью виден

const page8ShowStart   = 2600;  // page8 начинает появляться
const page8FadeInEnd   = 2700;  // page8 полностью виден

const page9ShowStart   = 2900;  // page9 начинает появляться
const page9FadeInEnd   = 3000;  // page9 полностью виден

export default function ScrollSections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

useEffect(() => {
    
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');
  const page4 = document.getElementById('page4');  
  const page5 = document.getElementById('page5');
  const page6 = document.getElementById('page6');
  const page7 = document.getElementById('page7');
  const page8 = document.getElementById('page8');
  const page9 = document.getElementById('page9');
    function updatePages() {
        if (page1 && page2 && page3 && page4 && page5 && page6 && page7 && page8 && page9) {
    const scrollY = window.scrollY;

    // === Управление page1 (уезжает наверх) ===
    if (scrollY <= 0) {
      page1.style.transform = 'translateY(0)';
      page1.style.opacity = '1';
      page1.style.backdropFilter = 'blur(0px)';
    } else {
      const blurAmount = Math.min(scrollY * 0.03, 10);
      const opacity = Math.max(1 - scrollY * 0.008, 0);
      page1.style.transform = `translateY(-${scrollY * 2.5}px)`;
      page1.style.opacity = `${opacity}`;
      page1.style.backdropFilter = `blur(${blurAmount}px)`;
    }

    // === Управление page2 (появляется, потом исчезает) ===

    if (scrollY > page2ShowStart) {
      if (scrollY < page2HideStart) {
        page2.style.opacity = '1';
        page2.classList.add('show');
      } else if (scrollY >= page2HideStart) {
        const fadeOutProgress = Math.min((scrollY - page2HideStart) / (page2FadeOutEnd - page2HideStart), 1);
        page2.style.opacity = `${1 - fadeOutProgress}`;
        if (fadeOutProgress === 1) {
          page2.classList.remove('show');
        }
      }
    } else {
      page2.style.opacity = '0';
      page2.classList.remove('show');
    }

    // === Управление page3 (появляется после page2) ===

    if (scrollY > page3ShowStart) {
      let opacity = 1;

      // Появление
      if (scrollY <= page3FadeInEnd) {
        opacity = (scrollY - page3ShowStart) / (page3FadeInEnd - page3ShowStart);
      }
      // Исчезание при появлении page4
      else if (scrollY >= page3HideStart) {
        opacity = 1 - (scrollY - page3HideStart) / (page3FadeOutEnd - page3HideStart);
        opacity = Math.max(opacity, 0);
      }

      page3.style.opacity = `${opacity}`;
      if (opacity > 0) {
        page3.classList.add('show');
      } else {
        page3.classList.remove('show');
      }
    } else {
      page3.style.opacity = '0';
      page3.classList.remove('show');
    }

    // === Управление page4 (появляется после page3) ===

    if (scrollY > page4ShowStart) {
      let opacity = 1;

      // Появление
      if (scrollY <= page4FadeInEnd) {
        opacity = (scrollY - page4ShowStart) / (page4FadeInEnd - page4ShowStart);
      }
      // Исчезание при появлении page5
      else if (scrollY >= page5ShowStart) {
        opacity = 1 - (scrollY - page5ShowStart) / (page5FadeInEnd - page5ShowStart);
        opacity = Math.max(opacity, 0);
      }

      page4.style.opacity = `${opacity}`;
      if (opacity > 0) {
        page4.classList.add('show');
      } else {
        page4.classList.remove('show');
      }
    } else {
      page4.style.opacity = '0';
      page4.classList.remove('show');
    }

    // === Управление page5 (появляется после page4, исчезает при page6) ===
    if (scrollY > page5ShowStart) {
      let opacity = 1;

      // Появление
      if (scrollY <= page5FadeInEnd) {
        opacity = (scrollY - page5ShowStart) / (page5FadeInEnd - page5ShowStart);
      }
      // Исчезание при появлении page6
      else if (scrollY >= page6ShowStart) {
        opacity = 1 - (scrollY - page6ShowStart) / (page6FadeInEnd - page6ShowStart);
        opacity = Math.max(opacity, 0);
      }

      page5.style.opacity = `${opacity}`;
      if (opacity > 0) {
        page5.classList.add('show');
      } else {
        page5.classList.remove('show');
      }
    } else {
      page5.style.opacity = '0';
      page5.classList.remove('show');
    }

    // === Управление page6 (появляется после page5) ===
    if (scrollY > page6ShowStart) {
      const fadeInProgress = Math.min(
        (scrollY - page6ShowStart) / (page6FadeInEnd - page6ShowStart),
        1
      );
      page6.style.opacity = `${fadeInProgress}`;
      if (fadeInProgress > 0) {
        page6.classList.add('show');
      } else {
        page6.classList.remove('show');
      }
    } else {
      page6.style.opacity = '0';
      page6.classList.remove('show');
    }

    if (scrollY >= page7ShowStart) {
      const fadeOutProgress = Math.min(
        (scrollY - page7ShowStart) / (page7FadeInEnd - page7ShowStart),
        1
      );
      page6.style.opacity = `${1 - fadeOutProgress}`;
    }

    if (scrollY > page7ShowStart) {
      const fadeInProgress = Math.min(
        (scrollY - page7ShowStart) / (page7FadeInEnd - page7ShowStart),
        1
      );
      page7.style.opacity = `${fadeInProgress}`;
      if (fadeInProgress > 0) {
        page7.classList.add('show');
      } else {
        page7.classList.remove('show');
      }
    } else {
      page7.style.opacity = '0';
      page7.classList.remove('show');
    }

    if (scrollY >= page8ShowStart) {
      const fadeOutProgress = Math.min(
        (scrollY - page8ShowStart) / (page8FadeInEnd - page8ShowStart),
        1
      );
      page7.style.opacity = `${1 - fadeOutProgress}`;
    }

    if (scrollY > page8ShowStart) {
      const fadeInProgress = Math.min(
        (scrollY - page8ShowStart) / (page8FadeInEnd - page8ShowStart),
        1
      );
      page8.style.opacity = `${fadeInProgress}`;
      if (fadeInProgress > 0) {
        page8.classList.add('show'); // <-- Добавляем класс 'show'
      } else {
        page8.classList.remove('show');
      }
    } else {
      page8.style.opacity = '0';
      page8.classList.remove('show');
    }

    if (scrollY >= page9ShowStart) {
      const fadeOutProgress = Math.min(
        (scrollY - page9ShowStart) / (page9FadeInEnd - page9ShowStart),
        1
      );
      page8.style.opacity = `${1 - fadeOutProgress}`;
    }

    if (scrollY > page9ShowStart) {
      const fadeInProgress = Math.min(
        (scrollY - page9ShowStart) / (page9FadeInEnd - page9ShowStart),
        1
      );
      page9.style.opacity = `${fadeInProgress}`;
      if (fadeInProgress > 0) {
        page9.classList.add('show'); // <-- Добавляем класс 'show'
      } else {
        page9.classList.remove('show');
      }
    } else {
      page9.style.opacity = '0';
      page9.classList.remove('show');
    }
}
  }

    window.addEventListener('scroll', updatePages);

    // Убираем обработчик при размонтировании
    return () => {
      window.removeEventListener('scroll', updatePages);
    };
},[]);


  // Лог для отладки
  useEffect(() => {
    console.log('Active index:', activeIndex);
  }, [activeIndex]);

  return (
    <>
      {components.map((P, i)=>{return (
        <P 
            key={i}
            show={activeIndex === i}
        />
      )})}
      
    <div className="content-spacer"></div>
    </>
  );
}
