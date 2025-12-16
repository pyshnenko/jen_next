import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "@/src/NavBar";
import Image from "next/image";
import P7 from "@/src/pageCards/P7";
import LinkButton from "@/src/components/LinkButton";

interface TextArray {
    text:string,
    img: null | {
        src: string
    },
    type: 'head'|'subHead'|'text'
}

const textArray: TextArray[] = [
    {
        text: 'Курс "Разработка игр на Unity"', 
        img: {src: '/jen/UnityLogo.png'}, 
        type: 'head'
    },
    {text: 'На курсе по Unity мы обучаем наши самые старшие группы созданию своих собственных компьютерных и мобильных игр в одном из самых популярных и востребованных игровых движков.', 
        img: null,
        type: 'subHead'
    },
    {
        text: '',
        img: null,
        type: 'text'
    }
]

export default function Minecraft(): React.ReactNode {
    return (
        <Box>
            <NavBar />
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fffa', pt: '120px'}}>
                <Box sx={{display: 'inline-flex'}}>
                    <Typography p={8} sx={{fontSize: '36px', padding: 4}} variant="h1">{textArray[0].text}</Typography>
                    {textArray[0].img && <Image alt="minr" src={textArray[0].img.src} width={200} height={70} />}
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>{textArray[1].text}</Typography>                
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 8}}>
                    <Typography sx={{width: '50%', fontSize:'18px'}}>Данный курс посвящен созданию игр на популярной платформе Roblox. За время курса ученики научатся создавать свои игровые карты, изучат язык программирования Lua и даже освоят основы мультиплеерной разработки.</Typography>
                    <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/Roblox_poster.png'} alt='mine1' width={300} height={300} />
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 8, paddingBottom: 0}}>
                    <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/Roblox1.png'} alt='mine1' width={700} height={300} />
                    <Typography sx={{width: '50%', fontSize:'18px'}}>Большое внимание на курсы мы выделяем именно программированию, в отличии от других обучающих курсов по Roblox мы вообще не берем готовые скрипты и всю игровую логику программируем сами. Это помогает понять главные принципы разработки IT проектов и прокачать свои навыки в программировании и решении школьных задач по информатике.</Typography>
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>Курс длится 8 месяцев, за которые помимо изучения языка программирования Lua и работы в Roblox Studio мы создадим 4 полноценные игры и даже выгрузим их в сам Roblox. Каждый проект у учеников будет индивидуальный и поможет развить как технические, так и творческие навыки!</Typography> 
                <Box sx={{width: '100%', height: '200px', position: 'relative'}}>
                    <Image style={{}} src={'/jen/RobloxFooter.jpg'} alt="proj" fill/>
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>А еще на наших занятиях дети находят своих единомышленников, учатся работать в команде и заводят новых друзей!</Typography> 
            </Box>
            <P7 noCard={true} show={true} />
            <P7 show={false} autoOpenDelay={30000} closeButton={true} />
            <LinkButton />
        </Box>
    )
}