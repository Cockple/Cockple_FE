declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export function loadKakaoMap(appKey: string) {
  return new Promise<void>((resolve, reject) => {
    // 이미 로드
    if (window.kakao?.maps) return resolve();

    // 이미 붙어있는 script가 있으면 그거 기다림
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoMaps = "true";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load kakao Maps SDK"));

    document.head.appendChild(script);
  });
}
