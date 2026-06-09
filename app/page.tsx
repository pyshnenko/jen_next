// app/page.tsx
import Image from "next/image";
import Script from "next/script";
import { Box } from "@mui/material";
import ScrollSections from "@/src/components/ScrollSections";
import NavBar from "@/src/NavBar";
import LinkButton from "@/src/components/LinkButton";

export default function Home() {
  return (
    <Box>      
      <LinkButton />
      <NavBar />
      {/* importmap must be before any module that uses it */}
      <Script
        id="importmap-three"
        type="importmap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `{
            "imports": {
              "three": "/library/threejs/build/three.module.js",
              "three/addons/": "/library/threejs/examples/jsm/"
            }
          }`
        }}
      />

      {/* robot module that relies on importmap */}
      <Script src="./jen/robot.js" type="module" strategy="afterInteractive" />
      <Script src="./jen/ya.js" strategy="afterInteractive" />

      {/* existing Yandex script */}
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=61fdef51-e176-420c-8c1a-dce383f077b7&lang=ru_RU"
        strategy="beforeInteractive"
      />

      <ScrollSections />
    </Box>
  );
}
