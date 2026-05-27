import { useEffect, useRef } from "react";
import apartmentsData from "../data/apartments.json";
import type { Apartment, MarkerEntry, Priorities } from "../types/apartment";
import { getAptId } from "../utils/apartment";
import { buildInfoWindowContent, registerInfoWindowClose } from "../utils/infoWindow";
import { getMarkerIcon } from "../utils/markerIcon";
import "./MapView.scss";

const apartments = apartmentsData as Apartment[];

type MapViewProps = {
  isScriptLoaded: boolean;
  priorities: Priorities;
  selectedAptId: string | null;
  isPanelOpen: boolean;
  onSelectApt: (apt: Apartment, aptId: string) => void;
  onCloseOverlays: () => void;
  suppressOutsideCloseRef: React.MutableRefObject<boolean>;
};

export const MapView = ({
  isScriptLoaded,
  priorities,
  selectedAptId,
  isPanelOpen,
  onSelectApt,
  onCloseOverlays,
  suppressOutsideCloseRef,
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const registryRef = useRef<Record<string, MarkerEntry>>({});
  const activeInfoRef = useRef<MarkerEntry | null>(null);
  const prioritiesRef = useRef(priorities);
  const onSelectAptRef = useRef(onSelectApt);
  const onCloseOverlaysRef = useRef(onCloseOverlays);

  prioritiesRef.current = priorities;
  onSelectAptRef.current = onSelectApt;
  onCloseOverlaysRef.current = onCloseOverlays;

  const closeActiveInfoWindow = () => {
    if (activeInfoRef.current?.infoWindow.getMap()) {
      activeInfoRef.current.infoWindow.close();
    }
    activeInfoRef.current = null;
  };

  const openMarker = (entry: MarkerEntry, aptId: string) => {
    suppressOutsideCloseRef.current = true;
    closeActiveInfoWindow();
    onSelectAptRef.current(entry.apt, aptId);
    entry.infoWindow.open(entry.map, entry.marker);
    activeInfoRef.current = entry;
  };

  useEffect(() => {
    return registerInfoWindowClose(() => onCloseOverlaysRef.current());
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.537, 126.737),
      zoom: 13,
    });
    mapInstanceRef.current = map;

    requestAnimationFrame(() => {
      map.autoResize();
    });

    apartments.forEach((apt) => {
      const aptId = getAptId(apt);

      naver.maps.Service.geocode({ query: apt.address }, (status, response) => {
        if (status !== naver.maps.Service.Status.OK) return;
        if (!mapInstanceRef.current) return;

        const result = response.v2.addresses[0];
        const position = new naver.maps.LatLng(result.y, result.x);
        const savedPriority = prioritiesRef.current[aptId] ?? null;

        const marker = new naver.maps.Marker({
          map,
          position,
          title: apt.name,
          icon: getMarkerIcon(savedPriority),
        });

        const infoWindow = new naver.maps.InfoWindow({
          content: buildInfoWindowContent(apt, savedPriority),
        });

        const entry: MarkerEntry = { marker, infoWindow, apt, map };
        registryRef.current[aptId] = entry;

        naver.maps.Event.addListener(marker, "click", () => {
          openMarker(entry, aptId);
        });
      });
    });

    return () => {
      closeActiveInfoWindow();
      Object.values(registryRef.current).forEach(({ marker }) => {
        marker.setMap(null);
      });
      registryRef.current = {};
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [isScriptLoaded]);

  useEffect(() => {
    Object.entries(registryRef.current).forEach(([aptId, entry]) => {
      const priority = priorities[aptId] ?? null;
      const wasOpen = !!entry.infoWindow.getMap();

      entry.marker.setIcon(getMarkerIcon(priority));
      entry.infoWindow.setContent(buildInfoWindowContent(entry.apt, priority));

      if (wasOpen) {
        entry.infoWindow.open(entry.map, entry.marker);
        activeInfoRef.current = entry;
      }
    });
  }, [priorities]);

  useEffect(() => {
    if (!selectedAptId) {
      closeActiveInfoWindow();
      return;
    }

    const entry = registryRef.current[selectedAptId];
    if (!entry) return;

    if (!entry.infoWindow.getMap()) {
      entry.infoWindow.open(entry.map, entry.marker);
      activeInfoRef.current = entry;
    }
  }, [selectedAptId]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (suppressOutsideCloseRef.current) {
        suppressOutsideCloseRef.current = false;
        return;
      }

      const isOverlayOpen =
        isPanelOpen || !!activeInfoRef.current?.infoWindow.getMap();
      if (!isOverlayOpen) return;

      const target = e.target as HTMLElement;

      if (
        target.closest("#apt-panel") ||
        target.closest(".legend") ||
        target.closest(".auth-status")
      ) {
        return;
      }

      if (target.closest(".info-window-close")) {
        onCloseOverlaysRef.current();
        return;
      }

      const contentEl = activeInfoRef.current?.infoWindow.getContentElement();
      if (contentEl?.contains(target)) return;

      onCloseOverlaysRef.current();
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isPanelOpen, suppressOutsideCloseRef]);

  return <div ref={mapRef} id="map" className="map-view" />;
};
