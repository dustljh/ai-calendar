declare const google: any;
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChatStore } from "@/storage/ChatSession";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { sortPlacesByDateTime } from "@/lib/utils";

const ItineraryMapSkeleton = () => {
  const { chatId } = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);

  const session = useChatStore((state) =>
    state.sessions.find((s) => s.id === chatId)
  );

  const messageCount = session?.messages.length || 0;

  const sortedPlaces = useMemo(() => {
    if (!session) return [];
    const lastAi = [...session.messages].reverse().find((m) => m.role === "ai");
    const places = lastAi?.planPlaces || [];
    return sortPlacesByDateTime(places);
  }, [session]);

  // 1. Google Maps API 최초 로드
  useEffect(() => {
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;
    const loadMap = async () => {
      try {
        setOptions({ key: "AIzaSyAD6ZYG-09j8nEMi3dg0DZ61La8nTFjP1U" });
        await Promise.all([importLibrary("maps"), importLibrary("marker")]);
        setApiLoaded(true);
      } catch (err) {
        console.error("Maps Load Error:", err);
      }
    };
    loadMap();
  }, []);

  // 2. 로딩 제어 로직 (3초 딜레이 제거)
  useEffect(() => {
    if (!chatId) return;

    const lastMessage = session?.messages[session.messages.length - 1];
    const isWaitingForAi = lastMessage?.role === "user";

    if (isWaitingForAi) {
      // 사용자가 질문을 던졌을 때 로딩 시작 및 기존 맵 정리
      setIsLoading(true);
      if (mapRef.current) mapRef.current.innerHTML = "";
    } else if (sortedPlaces.length > 0) {
      // 데이터가 준비되면 즉시 로딩 해제 (setTimeout 제거됨)
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [chatId, messageCount, sortedPlaces.length]);

  // 3. 지도 생성
  useEffect(() => {
    if (!isLoading && apiLoaded && mapRef.current && sortedPlaces.length > 0) {
      // 좌표 유효성 검사 (NaN 방지)
      const firstLat = Number(sortedPlaces[0].latitude);
      const firstLng = Number(sortedPlaces[0].longitude);

      if (isNaN(firstLat) || isNaN(firstLng)) return;

      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: firstLat, lng: firstLng },
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false,
      });

      const bounds = new google.maps.LatLngBounds();
      sortedPlaces.forEach((place, idx) => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const position = { lat, lng };
          const pin = new google.maps.marker.PinElement({
            glyphText: (idx + 1).toString(),
            background: "#EF4444",
            borderColor: "#FFFFFF",
            glyphColor: "#FFFFFF",
          });

          new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: place.title,
            content: pin.element,
          });
          bounds.extend(position);
        }
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [isLoading, apiLoaded, sortedPlaces]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white">
      <div
        ref={mapRef}
        className={`h-full w-full transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 shadow-inner">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="font-bold text-slate-500 text-sm animate-pulse text-center px-4">
            일정 순서에 맞춰 지도를 구성하고 있습니다... 🗺️
          </p>
        </div>
      )}

      {!isLoading && sortedPlaces.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
          <MapPin size={48} className="mb-2 opacity-20" />
          <p>생성된 여행 일정이 여기에 표시됩니다.</p>
        </div>
      )}

      {!isLoading && sortedPlaces.length > 0 && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-semibold z-10 shadow-md border border-slate-100 text-slate-700 animate-in fade-in duration-300">
          📍 {sortedPlaces.length}개 장소 (순서 정렬 완료)
        </div>
      )}
    </div>
  );
};

export default ItineraryMapSkeleton;