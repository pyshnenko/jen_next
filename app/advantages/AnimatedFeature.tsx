'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

type FeatureProps = {
  text: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  index: number;
};

export function AnimatedFeature({
  text,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  index,
}: FeatureProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById(`feature-${index}`);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Box
      id={`feature-${index}`}
      sx={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease-out',
      }}
    >
      <Box p={4} sx={{ maxWidth: '650px' }}>
        <Typography
          component="span"
          sx={{ fontSize: 'x-large', pr: 1 }}
        >
          {text.split(' ').slice(0, -1).join(' ')}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: 'x-large', color: 'green' }}
        >
          {text.split(' ').slice(-1)}
        </Typography>
        <p style={{ textAlign: 'left', marginTop: '8px' }}>{description}</p>
      </Box>
      <Box sx={{ padding: 4 }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageSrc.includes('rocket_pc') ? 250 : 350}
          height={imageSrc.includes('brit') ? 290 : 320}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.6s ease-out',
          }}
        />
      </Box>
    </Box>
  );
}
