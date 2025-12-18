import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "@/src/NavBar";
import Image from "next/image";
import P7 from "@/src/pageCards/P7";
import LinkButton from "@/src/components/LinkButton";
import Link from "next/link";

interface ImgData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  href?: string;
  pos?: 'left'|'right';
}

// Тип для блока с заголовком, подзаголовком или текстом
interface TextBlock {
  type: 'head' | 'subHead' | 'text';
  text: string;
  img: null | ImgData; // Явно указываем, что изображения нет
}

// Тип для блока с изображением
interface ImageBlock {
  type: 'imgBlock';
  text: string; // например, подпись или заголовок к изображению
  img: ImgData[]; // обязательный массив изображений
}

// Объединённый тип
type TextArray = TextBlock | ImageBlock;

const imgGenerator = (data:ImgData): React.ReactNode => {
    return (
        <Image 
            style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} 
            src={data.src} 
            alt='mine1' 
            width={data?.width || 300} 
            height={data?.height || 300}
        />
    )
}
const textBlock = (data:TextArray, index: number): React.ReactNode => {
    switch (data.type) {
        case 'head': return (
            <Box key={'blocks - '+index} sx={{display: 'inline-flex'}}>
                <Typography p={8} sx={{fontSize: '36px', padding: 4}} variant="h1">{data.text}</Typography>
                {data.img && <Image alt="minr" src={data.img.src} width={200} height={70} />}
            </Box>
        )
        case 'subHead': return (
            <Typography key={'blocks - '+index} p={8} sx={{fontSize: '24px', textAlign:'center'}}>{data.text}</Typography>
        )
        case 'text': return (
            <Box key={'blocks - '+index} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 8}}>
                {data?.img?.pos === 'left' && imgGenerator(data.img)}
                {data.text !== '' && <Typography sx={{width: '50%', fontSize:'18px'}}>{data.text}</Typography>}
                {data?.img?.pos === 'right' && imgGenerator(data.img)}
            </Box>
        )
        case 'imgBlock': return (
            <Box key={'blocks - '+index} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: 4, width: '100%', paddingBottom: 4}}>
                {data.img.map((item, index) => {
                    const img = <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={item.src} alt={item.alt} key={index} width={item?.width || 200} height={item?.height || 200} />
                    if (item?.href) return (
                    <Link href={item.href} key={index}>{img}</Link>)
                    else return (
                        <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={item.src} alt={item.alt} key={index} width={item?.width || 200} height={item?.height || 200} />
                    )
                })}
            </Box>
        )
    }
}

const textArray: TextArray[] = [
    {
        text: 'Курс "Разработка игр на Unity"', 
        img: {src: '/jen/UnityLogo.png'}, 
        type: 'head'
    } as TextArray,
    {text: 'На курсе по Unity мы обучаем наши самые старшие группы созданию своих собственных компьютерных и мобильных игр в одном из самых популярных и востребованных игровых движков.', 
        img: null,
        type: 'subHead'
    },
    {
        text: 'Данный курс основан на легендарном курсе по разработке игр от британской команды gamedev.tv. Мы адаптировали этот курс, чтобы ваш ребенок мог получить наиболее актуальные знания и создавать свои собственные игры!',
        img: {
            src : '/jen/unity.png',
            pos: 'left'
        },
        type: 'text'
    } as TextArray,
    {
        text: 'Каждое занятие мы не просто изучаем теорию создания игр и основы программирования, но работаем над конкретными проектами. Уже на 4-ом месяце обучения у наших учеников готовы целые 3 полноценные игры, а одну из них мы даже выгружаем в яндекс игры!',
        img: null,
        type: 'text'
    },
    {
        text: '',
        type: 'imgBlock', 
        img: [
            {
                src: '/jen/cookie_clicker.jpg', alt: 'coockie',
            },
            {
                src: '/jen/unityImg2.jpg', alt: 'crasher',
            },
            {
                src: '/jen/rocketUnity.png', alt: 'rocket',
            },
        ]
    },
    {
        type: 'text',
        img: null,
        text: 'Все скрипты (алгоритмы) на курсе мы пишем сами. К концу курса у учеников есть база знаний не только по школьной информатике, но также по архитектуре больших приложений: ООП, наследование, интерфейсы. Это те темы, которые изучают в университетах (нам удалось лаконично вписать их в нашу программу, чтобы дети поняли как все это работает).'
    },
    {
        type: 'imgBlock',
        text: '',
        img: [{
            src: '/jen/OOP.jpg', alt: 'oop', width: 900, height: 450
        }]
    }, 
    {
        type: 'text',
        img: null,
        text: 'Мы очень долго работали над этим курсом, поскольку сами являемся разработчиками игр. Данный курс мы регулярно обновляем и переписываем материалы, чтобы давать самые актуальные и полезные знания. На текущий момент - это один из самых лучших курсов по разработке игр на Unity, который в принципе есть в России!'
    },
    {
        type: 'text',
        img: null,
        text: 'Наши ученики не просто изучают программирование, они вдохновляются и начинают сами творить свои миры и развиваться в этом направлении. Ниже можете ознакомиться с мультиплеерной игрой, которую недавно выпустил наш ученик: Боков Семен. Это арена-выживалка, в которую можно поиграть вместе с другом. Весь код по логике управления и синхронизацию между персонажами мы писали сами!\n[Чтобы поиграть в неё достаточно просто кликнуть по картинке ниже]'
    },
    {
        type: 'imgBlock',
        img: [{
            src: '/jen/game.png', alt: 'game', width: 700, height: 400, href: 'https://simmer.io/@Code_Gap_Tutor/cyber-survive-arena'
        }],
        text: '',
    }
]

export default function Minecraft(): React.ReactNode {
    return (
        <Box>
            <NavBar />
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fffa', pt: '120px'}}>
                {textArray.map((item, index) => textBlock(item, index))}   
            </Box>
            <P7 noCard={true} show={true} />
            <P7 show={false} autoOpenDelay={30000} closeButton={true} />
            <LinkButton />
        </Box>
    )
}