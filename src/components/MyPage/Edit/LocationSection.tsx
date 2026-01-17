import { LocationField } from "@/components/common/LocationField";
import { Location } from "@/components/common/contentcard/Location";
import type { UserAddress } from "@/api/member/my";

interface Props {
  locations: UserAddress[];
  selectedId: number | null;
  editMode: boolean;
  toggleEditMode: () => void;
  onSelectMain: (id: number) => void;
  onDelete: (id: number) => void;
}

export const LocationSection = ({
  locations,
  selectedId,
  editMode,
  toggleEditMode,
  onSelectMain,
  onDelete,
}: Props) => {
  // 메인 위치가 맨 위로 오도록 정렬
  const sortedLocations = [...locations].sort((a, b) =>
    a.addrId === selectedId ? -1 : b.addrId === selectedId ? 1 : 0
  );

  return (
    <>
      <LocationField label="위치" />
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-1">
          <label className="text-left header-h5">등록된 위치</label>
          <button
            className="rounded-lg bg-[#F4F5F6] body-rg-500 px-4 py-2"
            onClick={toggleEditMode}
          >
            {editMode ? "저장" : "수정"}
          </button>
        </div>
        
        <div className="flex flex-col gap-2 text-start">
          {sortedLocations.map((loc, index) => (
            <Location
              key={loc.addrId}
              className="w-full"
              isMainAddr={loc.buildingName} 
              streetAddr={loc.streetAddr}
              initialClicked={loc.addrId === selectedId}
              disabled={editMode && index === 0} 
              editMode={editMode}
              onClick={() => !editMode && onSelectMain(loc.addrId)}
              onDelete={() => onDelete(loc.addrId)}
            />
          ))}
        </div>
      </div>
    </>
  );
};