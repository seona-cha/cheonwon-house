import { useEffect, useState } from "react";

const NAVER_MAP_SCRIPT_ID = "naver-map-sdk";

const isNaverMapsReady = (): boolean =>
  Boolean(
    window.naver?.maps?.Map && window.naver?.maps?.Service?.geocode
  );

export const useNaverMapScript = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(isNaverMapsReady);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_NAVER_MAP_KEY;

    if (!apiKey) {
      console.error("VITE_NAVER_MAP_KEY가 설정되지 않았습니다.");
      return;
    }

    let cancelled = false;

    const trySetLoaded = (): boolean => {
      if (!cancelled && isNaverMapsReady()) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (trySetLoaded()) return;

    let script = document.getElementById(
      NAVER_MAP_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      trySetLoaded();
    };

    if (!script) {
      script = document.createElement("script");
      script.id = NAVER_MAP_SCRIPT_ID;
      script.type = "text/javascript";
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}&submodules=geocoder`;
      script.onerror = () => console.error("네이버 지도 SDK 로드 실패");
      script.addEventListener("load", handleLoad);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", handleLoad);
    }

    if (trySetLoaded()) {
      return () => {
        cancelled = true;
        script?.removeEventListener("load", handleLoad);
      };
    }

    const pollId = window.setInterval(() => {
      if (trySetLoaded()) {
        window.clearInterval(pollId);
      }
    }, 50);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleLoad);
      window.clearInterval(pollId);
    };
  }, []);

  return isLoaded;
};
