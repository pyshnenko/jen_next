// app/page.tsx
import Image from "next/image";
import Script from "next/script";
import { Box } from "@mui/material";
import ScrollSections from "@/src/components/ScrollSections";

export default function Home() {
  return (
    <Box>
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=61fdef51-e176-420c-8c1a-dce383f077b7&lang=ru_RU"
        strategy="beforeInteractive"
      />
      <ScrollSections />
    </Box>
  );
}
