'use client';

import { useState, useEffect } from 'react';
import P1 from '../pageCards/P1';
import P2 from '../pageCards/P2';
import P3 from '../pageCards/P3';
import P4 from '../pageCards/P4';
import P5 from '../pageCards/P5';
import P6 from '../pageCards/P6';
import P7 from '../pageCards/P7';
import P8 from '../pageCards/P8';
import P9 from '../pageCards/P9';

const components = [P1, P2, P3, P4, P5, P6, P7, P8, P9];

export default function ScrollSections() {
    const [opacities, setOpacities] = useState<number[]>(
        (() => {
            const arr = new Array(components.length).fill(0);
            arr[0] = 1;
            return arr;
        })()
    );

    useEffect(() => {
        let raf = 0;

        function onScroll() {
            if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const vh = window.innerHeight || 800;

                    const normalized = scrollY / vh;
                    const firstFullEnd = 0.5;
                    const firstFadeEnd = 0.75;
                    const fadeWindow = 0.4;
                    const fadePortion = 0.25;

                    const finalOpacities = components.map((_, i) => {
                        if (i === 0) {
                            if (normalized <= firstFullEnd) return 1;
                            if (normalized >= firstFadeEnd) return 0;
                            return 1 - (normalized - firstFullEnd) / (firstFadeEnd - firstFullEnd);
                        }

                        const fadeInStart = i - fadeWindow;
                        const fadeInEnd = i;
                        const fullEnd = i + 1;
                        const fadeOutEnd = fullEnd + fadePortion;
                        const isLast = i === components.length - 1;

                        if (normalized <= fadeInStart) return 0;
                        if (normalized < fadeInEnd) {
                            const t = (normalized - fadeInStart) / (fadeInEnd - fadeInStart);
                            return Math.pow(Math.min(1, Math.max(0, t)), 0.95);
                        }
                        if (normalized <= fullEnd) return 1;
                        if (isLast) return 1;
                        if (normalized < fadeOutEnd) {
                            const t = (normalized - fullEnd) / (fadeOutEnd - fullEnd);
                            return Math.pow(Math.max(0, 1 - t), 0.95);
                        }
                        return 0;
                    });

                    setOpacities(finalOpacities);
                });
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    display: 'block',
                }}
            >
                <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                    {components.map((P, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'opacity 160ms ease, transform 180ms ease',
                                opacity: opacities[i],
                                pointerEvents: opacities[i] > 0 ? 'auto' : 'none',
                                transform: opacities[i] > 0 ? 'translateY(0)' : 'translateY(10px)',
                            }}
                        >
                            <P show={opacities[i] === 1} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: `${components.length * 100}vh` }} />
        </>
    );
}
