import React, { useState, useEffect } from "react";
import Camera from "../../../../assets/icons/camera.svg";
import CameraGY400 from "../../../../assets/icons/camera_gy_400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface AddPhotoMProps {
  initialStatus?: BtnStatus;
}

const MAX_IMAGES = 3;

const Add_Photo_M = ({ initialStatus = "default" }: AddPhotoMProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<BtnStatus>(initialStatus);

  // 이미지 개수에 따라 상태 자동 갱신
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
    //setStatus("default");
  };

  const getIcon = () => {
    switch (status) {
      case "disabled":
        return CameraGY400;
      default:
        return Camera;
    }
  };

  const getBg = () => {
    return status === "pressing" ? "bg-gy-100" : "";
  };

  const getTextColor = () => {
    return status === "disabled" ? "text-gy-400" : "text-black";
  };

  const isDisabled = status === "disabled" || images.length >= MAX_IMAGES;

  return (
    <div className={`flex items-start self-stretch gap-3 overflow-x-auto `}>
      {/* 상태 기반 업로드 버튼 */}
      <label
        className={`flex flex-col justify-center items-center gap-1 w-[6.25rem] h-[6.25rem] aspect-square border border-soft border-gy-200 ${getBg()} 
            ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        onMouseDown={() => !isDisabled && setStatus("pressing")}
        onMouseUp={() => !isDisabled && setStatus("clicked")}
        onMouseLeave={() => !isDisabled && setStatus("default")}
      >
        <img
          src={getIcon()}
          alt="upload"
          className="flex w-[1.5rem] h-[1.5rem] shrink-0 aspect-square"
        />
        <div className={`body-rg-500 ${getTextColor()}`}>
          {images.length} / {MAX_IMAGES}
        </div>
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
          className="relative w-[6.25rem] h-[6.25rem] flex-shrink-0 rounded-[0.75rem] overflow-hidden"
        >
          <img
            src={img}
            alt={`uploaded-${index}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleDeleteImage(index)}
            className="absolute top-1 right-1 text-white"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Add_Photo_M;
