import React, { useState, useEffect, useRef } from "react";
import Camera from "../../../../assets/icons/camera.svg";
import CameraGY400 from "../../../../assets/icons/camera_gy_400.svg";
import Clear_M from "./Clear_M";

//아이콘
import Delete from "../../../../assets/icons/dismiss_gy800.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface AddPhotoMProps {
  initialStatus?: BtnStatus;
}

const MAX_IMAGES = 3;

const Add_Photo_M = ({ initialStatus = "default" }: AddPhotoMProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<BtnStatus>(initialStatus);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (images.length >= MAX_IMAGES) {
      setStatus("disabled");
    } else if (status === "disabled") {
      setStatus("default");
    }
  }, [images]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || images.length >= MAX_IMAGES) return;

    const newImages = [...images];
    for (let i = 0; i < files.length && newImages.length < MAX_IMAGES; i++) {
      const fileUrl = URL.createObjectURL(files[i]);
      newImages.push(fileUrl);
    }
    setImages(newImages);
    setStatus("clicked");
    e.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!scrollRef.current) return;
    isDragging.current = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const getIcon = () => (status === "disabled" ? CameraGY400 : Camera);
  const getTextColor = () =>
    status === "disabled" ? "text-gy-400" : "text-black";
  const isDisabled = status === "disabled" || images.length >= MAX_IMAGES;

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto no-scrollbar select-none cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onDragStart={e => e.preventDefault()}
    >
      {/* 스크롤바 숨기기 */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* 업로드 버튼 */}
      <label
        className={`flex flex-col justify-center items-center gap-1 w-[100px] h-[100px] rounded-xl border ${
          isDisabled
            ? "cursor-not-allowed bg-gray-100 border-gray-300"
            : "cursor-pointer border-gray-300"
        } flex-shrink-0`}
        onMouseDown={() => !isDisabled && setStatus("pressing")}
        onMouseUp={() => !isDisabled && setStatus("clicked")}
        onMouseLeave={() => !isDisabled && setStatus("default")}
      >
        <img src={getIcon()} alt="upload" className="w-6 h-6" />
        <span className={`text-sm ${getTextColor()}`}>
          {images.length} / {MAX_IMAGES}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isDisabled}
          onChange={handleImageUpload}
        />
      </label>

      {/* 업로드된 이미지들 */}
      {images.map((img, index) => (
        <div
          key={index}
          className="relative w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0"
        >
          <img
            src={img}
            alt={`uploaded-${index}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 z-10">
            <Clear_M
              onClick={() => handleDeleteImage(index)}
              iconMap={{
                disabled: Delete,
                default: Delete,
                pressing: Delete,
                clicked: Delete,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Add_Photo_M;
