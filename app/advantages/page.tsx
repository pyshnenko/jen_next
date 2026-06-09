// Серверный компонент — нет 'use client'

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { ClientAnimations } from './ClientAnimations';
import P7 from '@/src/pageCards/P7';
import LinkButton from '@/src/components/LinkButton';

export default function Advantages() {
  const features = [
    {
      text: 'Развитая сетевая инфраструктура школы',
      description:
        'Наша школа программирования имеет собственные сетевые ресурсы, организованные по самым современным технологиям. Лучшие сотрудники АО "Ростех" круглосутучно контролируют и улучшают работу наших сервисов. Мы гарантируем доступ к школьным сервисам и методическим материалам в любое времяи не зависим от внутригосударственных и внешних ограничений',
      imageSrc: '/jen/server2.png',
      imageAlt: 'Мини-группы',
      reverse: true,
    },
    {
      text: 'Мини-группы по 8 учеников',
      description:
        'Более 6 лет преподавательского опыта показали, что оптимальный размер группы для обучения 4-8 человек. Большее количество учеников попросту не позволяет уделить внимание каждому.',
      imageSrc: '/jen/Group.png',
      imageAlt: 'Мини-группы',
      reverse: false,
    },
    {
      text: 'Курсы из Британии',
      description:
        'Наши методические материалы основаны на курсах от британской команда gamedev.tv. Эти британские курсы признаны одними из лучших для обучения программированию.',
      imageSrc: '/jen/brit.png',
      imageAlt: 'Курс из Британии',
      reverse: true,
    },
    {
      text: 'Преподавательский состав',
      description:
        'Наши преподаватели имеют опыт работы с реальными IT проектами, а также занимаются обучением детей более 4-х лет. Они действительно любят и горят своей профессией и эту искру вдохновения стремятся передать каждому ученику!',
      imageSrc: '/jen/teacher.webp',
      imageAlt: 'Преподавательский состав',
      reverse: false,
    },
    {
      text: 'Видеоуроки после занятий',
      description:
        'После каждого занятия по любому из курсов мы высылаем видеоурок с пройденным материалом и домашнем заданием. Это позволяет наиболее эффективно закреплять пройденным материал. А также изучать дополнительные темы, увлеченным детям!',
      imageSrc: '/jen/camera.png',
      imageAlt: 'Видеоуроки после занятий',
      reverse: true,
    },
    {
      text: 'Качество над количеством',
      description:
        'Мы не стремимся создать курсы по сотням направлений. Мы направили все наши силы на создание нескольких лучших программ и регулярно дорабатываем их, чтобы ваш ребенок смог получить самые полезные и востребованные знания 21-го века!',
      imageSrc: '/jen/prise.png',
      imageAlt: 'Качество над количеством',
      reverse: false,
    },
    {
      text: 'Практические курсы',
      description:
        'Мы всегда закрепляем теоретический материал практикой. На всех наших курсах дети работают над конкретными IT - проектами (своя игра, 3d рендер и др.). Это позволяет ученикам усваивать материал естественно и без зубрёжки. Также в конце каждого курса у детей будет несколько крутых проектов в своём портфолио!',
      imageSrc: '/jen/rocket_pc.png',
      imageAlt: 'Практические курсы',
      reverse: true,
    },
    // ... остальные
  ] as const;

  return (
    <Box sx={{ position: 'relative' }}>
        <style
        dangerouslySetInnerHTML={{
          __html: `
          .feature-block {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
          }
          .feature-block.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `,
        }}
      />
      {/* Баннер — статично */}
      <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/jen/549063-low-poly-land.jpg.webp"
          alt="head"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: '-webkit-linear-gradient(top, rgba(78, 115, 64, 0.4), rgba(52, 78, 56, 0.4))',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '6vw',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
              textAlign: 'center',
              letterSpacing: '1.2px',
            }}
            variant="h1"
          >
            Наши достоинства
          </Typography>
        </Box>
      </Box>

      {/* Логотип */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, padding: 2, zIndex: 10 }}>
        <Link href="/">
          <Image src="/jen/logo.webp" alt="logo" width={100} height={100} />
          <Typography
            sx={{
              position: 'relative',
              top: '-20px',
              color: 'white',
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
            variant="h6"
          >
            На главную
          </Typography>
        </Link>
      </Box>
      <Box sx={{position: 'absolute', top: 0, right: 0, width: 400, height: 175}}>
        <Image fill alt='Microsoft' src={'/jen/microsoft-advanced-e.png.webp'} />
      </Box>
        <LinkButton />
      <Box sx={{ backgroundColor: '#fffa', textAlign: 'center', fontSize: '24px' }}>
        <Box p={8}>
          <Typography sx={{ fontSize: 'xx-large' }} variant="h3">
            Как мне выбрать курсы программирования?
          </Typography>
          <p style={{ textAlign: 'center' }}>
            Это действительно важный вопрос для ответственного родителя. На текущий момент существуют множество как онлайн, так и офлайн школ для изучения программирования детьми. Если вы уже изучали этот момент, то могли заметить, что отличий действительно между ними мало. Однако наша академия предлагает такие преимущества, которых нет у других школ. <br/>А именно:
          </p>
        </Box>

        {/* Статические блоки — серверный рендер */}
        {features.map((feature, index) => (
          <Box
            key={index}
            id={`feature-${index}`}
            className="feature-block"
            sx={{
              display: 'flex',
              flexDirection: feature.reverse ? 'row-reverse' : 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-evenly',
              // Никаких анимаций здесь — только класс
            }}
          >
            <Box p={4} sx={{ maxWidth: '650px' }}>
              <Typography
                component="span"
                sx={{ fontSize: 'x-large', pr: 1 }}
              >
                {feature.text}
              </Typography>
              <p style={{ textAlign: 'left', marginTop: '8px' }}>
                {feature.description}
              </p>
            </Box>
            <Box sx={{ padding: 4 }}>
              <Image
                src={feature.imageSrc}
                alt={feature.imageAlt}
                width={feature.imageSrc.includes('rocket_pc') ? 250 : 350}
                height={feature.imageSrc.includes('brit') ? 290 : 320}
              />
            </Box>
          </Box>
        ))}
      </Box>
        <P7 show={false} closeButton={true} autoOpenDelay={30000} />
        <P7 show={true} noCard={true} />
      {/* Подключаем анимации — минимальный клиентский компонент */}
      <ClientAnimations />
    </Box>
  );
}
