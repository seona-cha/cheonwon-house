import { useEffect, useState } from "react";

const NAVER_MAP_SCRIPT_ID = "naver-map-sdk";

export const useNaverMapScript = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_NAVER_MAP_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error("VITE_NAVER_MAP_KEY가 설정되지 않았습니다.");
      return;
    }

    if (window.naver?.maps) {
      setIsLoaded(true);
      return;
    }

    const existing = document.getElementById(NAVER_MAP_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.type = "text/javascript";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}&submodules=geocoder`;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error("네이버 지도 SDK 로드 실패");
    document.head.appendChild(script);
  }, [apiKey]);

  return isLoaded;
};
