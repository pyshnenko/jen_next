import React from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "@/src/NavBar";
import Image from "next/image";
import P7 from "@/src/pageCards/P7";
import LinkButton from "@/src/components/LinkButton";

export default function Minecraft(): React.ReactNode {
    return (
        <Box>
            <NavBar />
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fffa', pt: '120px'}}>
                <Box sx={{display: 'inline-flex'}}>
                    <Typography p={8} sx={{fontSize: '36px', padding: 4}} variant="h1">Курс "Создание игр в Roblox Studio"</Typography>
                    <Image alt="minr" src='/jen/RobloxTop.png' width={100} height={100} />
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>Если вы когда-нибудь задумывались о разработке игр, но опыта программирования у вас нет, то курс "Создание игр в Roblox Studio" именно для вас!</Typography>                
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