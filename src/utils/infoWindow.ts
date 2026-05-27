import type { Apartment, Priority } from "../types/apartment";

export const buildInfoWindowContent = (
  apt: Apartment,
  currentPriority: Priority | null | undefined
): string => {
  const closeHandler = `window.__cheonwonCloseOverlay?.()`;

  return `
    <div class="info-window">
      <button
        type="button"
        class="info-window-close"
        aria-label="팝업 닫기"
        onclick="${closeHandler}; return false;"
      >×</button>
      <div class="title">${apt.name} <span class="priority">${currentPriority?currentPriority+'순위':''}</span></div>
      <div><span class="panel-label">준공년도 ·</span> ${apt.year}</div>
      <div><span class="panel-label">주소 ·</span> ${apt.address}</div>
    </div>
  `;
};

declare global {
  interface Window {
    __cheonwonCloseOverlay?: () => void;
  }
}

export const registerInfoWindowClose = (handler: () => void): (() => void) => {
  window.__cheonwonCloseOverlay = handler;
  return () => {
    delete window.__cheonwonCloseOverlay;
  };
};
