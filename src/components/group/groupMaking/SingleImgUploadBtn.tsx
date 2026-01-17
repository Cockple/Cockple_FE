import { useEffect, useRef, useState } from "react";
import CameraIcon from "@/assets/icons/camera.svg?url";
import DissMiss_GY from "@/assets/icons/dismiss_gy800.svg?url";
import { useGroupMakingFilterStore } from "@/store/useGroupMakingFilter";
import { uploadImage } from "@/api/image/imageUpload";

export default function SingleImageUploadBtn() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null); // imgKey, imgUrl는 store에서 가져다 씀
  const { setFilter, imgUrl: imgUrlStore } = useGroupMakingFilterStore();

  const displaySrc = preview ?? imgUrlStore ?? null;
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const { imgUrl, imgKey } = await uploadImage("PARTY", file);
      setFilter("imgKey", imgKey);
      setFilter("imgUrl", imgUrl);
      URL.revokeObjectURL(objectUrl);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
      setPreview(null);
      setFilter("imgKey", "");
      setFilter("imgUrl", "");
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFilter("imgKey", "");
    setFilter("imgUrl", "");
    // input 초기화
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div>
      <label
        htmlFor="image-upload"
        className={`relative flex flex-col justify-center items-center gap-1 w-[100px] h-[100px] rounded-xl border ${"cursor-pointer border-gray-300"} flex-shrink-0`}
      >
        {!displaySrc && <img src={CameraIcon} alt="" className="absolute" />}
        {/* 이미지 있 */}
        {displaySrc && (
          <>
            <img
              src={displaySrc}
              alt="업로드된 이미지"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
            />
            <div
              className="absolute top-1 right-0 z-10"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(e);
              }}
            >
              <img src={DissMiss_GY} alt="삭제" className="w-6 h-6" />
            </div>
          </>
        )}
      </label>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        id="image-upload"
      />
    </div>
  );
}
