import { useRef, useState } from "react";

export default function SingleImageUploadBtn() {
  const [image, setImage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      // fileInput.current = file;
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
  };

  return (
    <div>
      <label
        htmlFor="image-upload"
        className={`relative flex flex-col justify-center items-center gap-1 w-[100px] h-[100px] rounded-xl border ${"cursor-pointer border-gray-300"} flex-shrink-0`}
      >
        {!image && (
          <img src="/src/assets/icons/camera.svg" alt="" className="absolute" />
        )}
        {/* 이미지 있 */}
        {image && (
          <>
            <img
              src={image}
              alt="업로드된 이미지"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-1 right-0 z-10" onClick={handleRemove}>
              <img
                src="/src/assets/icons/dismiss_gy800.svg"
                alt="삭제"
                className="w-6 h-6"
              />
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
