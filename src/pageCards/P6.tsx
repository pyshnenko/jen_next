import React, { useState } from 'react';

interface Props {
    show: boolean;
}

export default function P6({ show }: Props): React.ReactElement {
    const items = [
        {
            img: './jen/evgen.jpg',
            name: 'Евгений',
            front:
                'Основатель, Unity разработчик, Создатель методических материалов<br/>Выпускник МГТУ им. Н.Э. Баумана',
            back:
                'Евгений работает в области разработки игр уже более 9 лет, а преподает разработку игр для детей более 7-ти лет. Он обожает Unity и язык программирования C#. В методические материалы он вложил всю свою душу и любовь к программированию.',
        },
        {
            img: './jen/martin.jpg',
            name: 'Мартин',
            front:
                'Основатель, Web разработчик, Работа над соц. сетями<br/>Выпускник МГУ им. М.В. Ломоносова',
            back:
                'Мартин является Fullstack и Python разработчиком более 7 лет. Опыт преподавания детям 5 лет. Язык программирования Python - его страсть, именно поэтому наш курс программирования на этом языке разработан Мартином. Также в нашей команде он отвечает за SMM и наши соц. сети.',
        },
    ];

    const [flipped, setFlipped] = useState<boolean[]>(new Array(items.length).fill(false));

    const toggle = (index: number) => {
        setFlipped((s) => {
            const next = [...s];
            next[index] = !next[index];
            return next;
        });
    };

    const onKey = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle(idx);
        }
    };

    return (
        <div id="page6" className={`page2 ${show ? 'show' : ''}`}>
            <div className="card">
                <h3>Наша команда</h3>
                <div className="card">
                    <div className="carousel" role="list">
                        {items.map((it, idx) => (
                            <div
                                key={idx}
                                role="button"
                                aria-pressed={flipped[idx]}
                                tabIndex={0}
                                className={`carousel-item revertable ${flipped[idx] ? 'flipped' : ''}`}
                                data-back={it.back}
                                onClick={() => toggle(idx)}
                                onKeyDown={(e) => onKey(e, idx)}
                            >
                                <div className="flip-inner" aria-hidden={flipped[idx]}>
                                    <div className="face front">
                                        <img src={it.img} alt={it.name} />
                                        <h5>{it.name}</h5>
                                        <p dangerouslySetInnerHTML={{ __html: it.front }} />
                                    </div>
                                    <div className="face back" dangerouslySetInnerHTML={{ __html: it.back }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .carousel {
                    display: flex;
                    gap: 14px;
                    align-items: center;
                    padding: 12px 16px;
                    box-sizing: border-box;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    scroll-snap-type: x mandatory;
                    scroll-padding-left: 16px; /* чтобы snap учитывал отступ */
                }

                /* чуть уже, но длиннее карточки */
                .carousel-item {
                    width: 260px;              /* уже */
                    height: 560px;             /* длиннее */
                    flex: 0 0 auto;
                    perspective: 1200px;
                    cursor: pointer;
                    outline: none;
                    border-radius: 12px;
                    scroll-snap-align: start; /* первая карточка будет показываться полностью слева */
                    box-sizing: border-box;
                }

                .flip-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 600ms cubic-bezier(0.2, 0.9, 0.3, 1);
                    border-radius: 12px;
                }

                .carousel-item.flipped .flip-inner {
                    transform: rotateY(180deg);
                }

                .face {
                    position: absolute;
                    inset: 0;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                    border-radius: 12px;
                    background: white;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
                }

                .face.front img {
                    width: 44%;
                    height: auto;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-bottom: 16px;
                }

                .face.front h5 {
                    margin: 8px 0;
                    font-size: 20px;
                }

                .face.front p {
                    font-size: 15px;
                    line-height: 1.4;
                    text-align: center;
                }

                .face.back {
                    transform: rotateY(180deg);
                    text-align: center;
                    font-size: 14px;
                    line-height: 1.4;
                    padding: 20px;
                }

                .carousel-item:active .flip-inner {
                    transition-duration: 200ms;
                }

                /* tablet */
                @media (max-width: 900px) {
                    .carousel-item {
                        width: 240px;
                        height: 580px;
                    }
                }

                /* narrow screens: keep horizontal carousel, show first card fully and allow horizontal scroll to next */
                @media (max-width: 600px) {
                    .carousel {
                        gap: 12px;
                        padding-left: 16px; /* чтобы первая карточка полностью видна */
                        scroll-padding-left: 16px;
                    }

                    /* ширина карты = ширина экрана минус паддинг вокруг, чтобы влезала целиком */
                    .carousel-item {
                        width: calc(100vw - 32px);
                        max-width: 320px; /* на небольших планшетах ограничить */
                        height: 62vh;
                    }

                    .face.front img {
                        width: 38%;
                        margin-bottom: 12px;
                    }

                    .face.front p {
                        font-size: 14px;
                        padding: 0 8px;
                    }

                    .face.back {
                        font-size: 14px;
                        padding: 18px;
                    }
                }
            `}</style>
        </div>
    );
}