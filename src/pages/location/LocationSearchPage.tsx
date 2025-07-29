import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useDebounce } from "../../hooks/useDebounce";
import Search from "@/assets/icons/search.svg?react";
import axios from "axios";
import MyLocation from "@/assets/icons/mylocation.svg";
import White_L_Thin from "../../components/common/Btn_Static/Text/White_L_Thin";
import { LocationList } from "../../components/common/contentcard/LocationList";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export interface Place {
  id?: string;
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

export const LocationSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const [input, setInput] = useState(initialQuery);
  const debouncedInput = useDebounce(input, 200);
  const [results, setResults] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const location = useLocation();
  const returnPath = location.state?.returnPath ?? "/";

  const fetchPlaces = async (newPage = 1, isNewSearch = false) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_SEARCH_KEY}`,
          },
          params: {
            query: debouncedInput,
            page: newPage,
            size: 15,
          },
        },
      );
      const newResults = res.data.documents;
      const totalCount = res.data.meta.total_count;

      setResults(prev => (isNewSearch ? newResults : [...prev, ...newResults]));
      setHasMore(newPage * 15 < totalCount);
      setPage(newPage);
      console.log(newResults);
    } catch (err) {
      console.error("Erorr fetching places", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      return;
    }
    fetchPlaces(1, true);
  }, [debouncedInput]);

  const lastResultRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPlaces(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, debouncedInput],
  );

  const onClickCurrent = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          "https://dapi.kakao.com/v2/local/geo/coord2address.json",
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_SEARCH_KEY}`,
            },
            params: {
              x: longitude,
              y: latitude,
            },
          },
        );

        const addressInfo = res.data.documents?.[0]?.address;
        const roadAddressInfo = res.data.documents?.[0]?.road_address;

        const place = roadAddressInfo?.building_name || "현재 위치";
        const address =
          roadAddressInfo?.address_name || addressInfo.address_name || "";

        navigate(
          `/location/map?x=${longitude}&y=${latitude}&place=${encodeURIComponent(place)}&address=${encodeURIComponent(address)}&query=${encodeURIComponent(input ?? "")}`,
        );
      } catch (err) {
        console.error("주소 정보 가져오기 실패", err);
        alert("주소 정보를 불러올 수 없습니다.");
      }
    });
  };

  const handleSelect = (place: Place) => {
    navigate(returnPath, {
      state: {
        selectedPlace: {
          name: place.place_name,
          address: place.address_name,
          x: place.x,
          y: place.y,
        },
      },
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="주소 검색" />
      <div className="flex flex-col mt-5 gap-6">
        <div className="flex flex-col w-full gap-2">
          <div className="w-full flex py-2.5 px-3 border-1 border-gy-200 border-soft">
            <input
              className="header-h5 flex-1 outline-none"
              type="text"
              placeholder="시설명, 도로명으로 검색"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                setSelectedId(null);
              }}
            />
            <button>
              <Search />
            </button>
          </div>
          <White_L_Thin
            icon={MyLocation}
            label="현재 위치 불러오기"
            onClick={onClickCurrent}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          {results.map((item, idx) => {
            const isLast = idx === results.length - 1;
            return (
              <div
                className="flex justify-center pb-1 mb-1 border-b-1 border-gy-200"
                key={idx}
                ref={isLast ? lastResultRef : null}
              >
                <LocationList
                  id={idx}
                  isMainAddr={item.place_name}
                  streetAddr={item.address_name}
                  x={item.x}
                  y={item.y}
                  input={debouncedInput}
                  initialClicked={selectedId === idx}
                  onClick={(id, clicked) => setSelectedId(clicked ? id : null)}
                  returnPath={returnPath}
                />
              </div>
            );
          })}

          {isLoading && (
            <div className="py-4 text-center text-gy-400">불러오는 중...</div>
          )}
        </div>
        {selectedId !== null && (
          <div
            className="fixed bottom-0 w-full max-w-[444px] flex justify-center -ml-4 bg-white"
            onClick={() => handleSelect(results[selectedId])}
          >
            <Grad_GR400_L label="이 위치로 위치 등록" />
          </div>
        )}
      </div>
    </div>
  );
};
