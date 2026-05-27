declare namespace naver.maps {
  class LatLng {
    constructor(lat: number | string, lng: number | string);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Map {
    constructor(element: string | HTMLElement, options?: MapOptions);
    getElement(): HTMLElement;
    autoResize(): void;
    destroy(): void;
  }

  type MapOptions = {
    center?: LatLng;
    zoom?: number;
  };

  class Marker {
    constructor(options: MarkerOptions);
    setIcon(icon: MarkerIcon): void;
    setMap(map: Map | null): void;
  }

  type MarkerOptions = {
    map?: Map;
    position?: LatLng;
    title?: string;
    icon?: MarkerIcon;
  };

  type MarkerIcon = {
    content: string;
    anchor: Point;
  };

  class InfoWindow {
    constructor(options: { content: string });
    open(map: Map, marker: Marker): void;
    close(): void;
    getMap(): Map | null;
    setContent(content: string): void;
    getContentElement(): HTMLElement;
  }

  namespace Service {
    enum Status {
      OK = "OK",
    }

    const geocode: (
      options: { query: string },
      callback: (
        status: Status,
        response: {
          v2: {
            addresses: Array<{ x: string; y: string }>;
          };
        }
      ) => void
    ) => void;
  }

  namespace Event {
    const addListener: (
      target: object,
      eventName: string,
      listener: (e?: { domEvent?: MouseEvent }) => void
    ) => void;
  }
}

declare const naver: {
  maps: typeof naver.maps;
};
