import React from 'react';
import { Box } from '@mui/material';

interface Props {
    show: boolean;
}

export default function P2({show}:Props):React.ReactNode {
    return (
        <Box id="page2" className={`page9${show?' show':''}`}>
            <Box className="card">
                <Box id="map"></Box>
                <Box className="contacts-section" id="contacts">
                    <h3>Наши филиалы</h3>
                    <Box className="addresses">
                        <Box className="address-card" data-id="1">
                            <h4>1. Наро-Фоминск</h4>
                            <p>ул. Маршала Жукова, 6Б<br/>
                            Бизнес-центр «Корвет»<br/>
                            </p>
                        </Box>
                        <div className="address-card" data-id="2">
                            <h4>2. Обнинск</h4>
                            <p>
                            ул. Аксёнова, 18Б<br/>
                            Детский центр «Арена»<br/>
                            </p>
                        </div>
                        <div className="address-card" data-id="3">
                            <h4>3. Селятино</h4>
                            <p>
                                ул. Спортивная, 5/1<br/>
                                Центральная библиотека<br/>
                            </p>
                        </div>
                    </Box>
                    <div style={{
                        marginTop: '20px', 
                        fontFamily: "'Ubuntu, sans-serif'",
                        color: '#013831'}}>
                        <p><strong>📞 Телефон:</strong> +7 995 757 87 46</p>
                        <p><strong>📧 Email:</strong> info@code-gap.ru</p>
                    </div>
                </Box>
            </Box>
        </Box>
    )
}