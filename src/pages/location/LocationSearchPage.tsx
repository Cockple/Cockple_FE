import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useDebounce } from "../../hooks/useDebounce";
import Search from "@/assets/icons/search.svg?react";
import axios from "axios";
import MyLocation from "@/assets/icons/mylocation.svg";
import White_L_Thin from "../../components/common/Btn_Static/Text/White_L_Thin";
import { LocationList } from "../../components/common/contentcard/LocationList";

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

export const LocationSearchPage = () => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 400);
  const [results, setResults] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

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
              onChange={e => setInput(e.target.value)}
            />
            <button>
              <Search />
            </button>
          </div>
          <White_L_Thin icon={MyLocation} label="현재 위치 불러오기" />
        </div>

        <div className="flex flex-col">
          {results.map((item, idx) => {
            const isLast = idx === results.length - 1;
            return (
              <div
                className="pb-1 mb-1 border-b-1 border-gy-200"
                key={idx}
                ref={isLast ? lastResultRef : null}
              >
                <LocationList
                  id={idx}
                  isMainAddr={item.place_name}
                  streetAddr={item.address_name}
                />
              </div>
            );
          })}

          {isLoading && (
            <div className="py-4 text-center text-gy-400">불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  );
};
