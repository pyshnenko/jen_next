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
                    <Typography p={8} sx={{fontSize: '36px', padding: 4}} variant="h1">Курс "Основы программирования в Minecraft Education"</Typography>
                    <Image alt="minr" src='/jen/minecraftTop.png' width={100} height={100} />
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>По нашим исследованиям, дети не всегда могут понять основы программирования в раннем возрасте. Более того, не все в 8 лет умеют читать и писать. Зато именно в этом возрасте можно обеспечить развитие аналитических навыков и научить ребенка формировать причинно-следственные связи, что является основой алгоритмов<br/>
                Наилучшей формой обучения в раннем возрасте является игра.</Typography>                
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>На курсе Основы программирования в Minecraft мы знакомим самых юных учеников с потрясающим миром алгоритмов в Minecraft: Education - специальной версии всеми любимой игры, в которой можно ещё и программировать!<br/>
                Навыки, полученные на курсе, позволят ребенку не только перейти к непосредственному изучению "взрослых" языков программирования, но и позволят лучше ориентироваться в других предметах и бытовых задачах.
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 8}}>
                    <Typography sx={{width: '50%', fontSize:'18px'}}>Данный курс рассчитан на детей возрастом от 7 до 10 лет и на нем мы на базе игры Майнкрафт учимся писать свои первые алгоритмы. Курс длится 8 месяцев, за которые мы изучаем не только основы, но ещё и более продвинутые темы из области программирования (Функции, массивы и прочее).</Typography>
                    <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/noroot.jpg'} alt='mine1' width={300} height={300} />
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 8, paddingBottom: 0}}>
                    <Typography sx={{fontSize:'18px'}}>Вначале мы учимся составлять программы при помощи блоков, ребенку даже не нужно уметь писать на клавиатуре, однако ближе к концу курса мы уже учимся создавать алгоритмы на реальном языке программирования Python.</Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: 4, width: '100%', paddingBottom: 4}}>
                    <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/Mine_blocks.png'} alt='mine1' width={300} height={300} />
                    <svg style={{width: '200px'}} viewBox="5956.5556640625 5076 98.4443359375 65"> <path fill="#43b939" fillOpacity="1" stroke="#5a90c6" strokeOpacity="1" strokeWidth="2" id="tSvgcf4759e311" d="M 5959 5099 C 5960 5099 6024 5099 6024 5099 C 6024 5099 6024 5078 6024 5078 C 6024 5078 6053 5110 6053 5110 C 6053 5110 6024 5139 6024 5139 C 6024 5139 6024 5121 6024 5121 C 6024 5121 5959 5121 5959 5121C 5959 5121 5958 5099 5959 5099 Z"></path> <defs></defs> </svg>
                    <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/Mine_Python.png'} alt='mine1' width={300} height={300} />
                </Box>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>За 8 месяцев обучения ученики будут разрабатывать несколько больших проектов для своего IT портфолио, а также получат все необходимые знания по основам программирования (включая опыт решения школьных задач по информатике).</Typography> 
                <Image style={{borderRadius: '25px', boxShadow: '0 0 10px black'}} src={'/jen/Project.png'} alt="proj" width={700} height={350}/>
                <Typography p={8} sx={{fontSize: '24px', textAlign:'center'}}>А еще на наших занятиях дети находят своих единомышленников, учатся работать в команде и заводят новых друзей!</Typography> 
            </Box>
            <P7 noCard={true} show={true} />
            <P7 show={false} autoOpenDelay={30000} closeButton={true} />
            <LinkButton />
        </Box>
    )
}