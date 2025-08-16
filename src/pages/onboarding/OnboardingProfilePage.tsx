import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import ProfileImg from "../../components/common/Etc/ProfileImg";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import IntroText from "../../components/onboarding/IntroText";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import ProfileImgIcon from "@/assets/images/profile_Image.png?url";
import Basic_ProfileImg from "@/assets/images/base_profile_img.png?url";
import { uploadImage } from "../../api/image/imageUpload";

export const OnboardingProfilePage = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  //crop라이브러리
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
    };
  }, [originalImage]);

  const handleClick = () => {
    if (isProfile) {
      navigate("/confirm");
    } else {
      fileInput.current?.click();
    }
  };

  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setIsCropping(true);
      e.currentTarget.value = "";
    }
  };

  const getCroppedDataURL = (
    imageSrc: string,
    cropPixels: Area,
  ): Promise<string> => {
    return new Promise(resolve => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height,
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const dataURLToFile = async (
    dataURL: string,
    filename = "profile.jpg",
  ): Promise<File> => {
    const res = await fetch(dataURL);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  };
  const handleCropConfirm = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    try {
      setIsUploading(true);

      const croppedDataURL = await getCroppedDataURL(
        originalImage,
        croppedAreaPixels,
      );

      const croppedFile = await dataURLToFile(croppedDataURL, "profile.jpg");

      // 이미지 업로드
      const { imgUrl } = await uploadImage("PROFILE", croppedFile);

      // 미리보기 갱신
      setPreview(imgUrl);
      setIsProfile(true);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={` flex flex-col relative -mb-8 min-h-[100dvh] pt-14 ${isCropping ? "-mx-4" : ""}`}
      style={{ maxWidth: "444px", minHeight: "100dvh" }}
    >
      <PageHeader title="회원 정보 입력" />
      {isCropping ? "" : <ProgressBar width={isProfile ? "96" : "76"} />}
      <section className=" flex flex-col gap-[6.25rem] text-left flex-1 ">
        <div>
          <IntroText
            title="프로필을 등록해주세요."
            text1="내 모습을 보여주면,"
            text2="모임에서 더 빠르게 친해질 수 있어요!"
            isBar={true}
          />
        </div>
        <label
          htmlFor={isProfile ? "image-upload" : ""}
          className={`w-fit  mx-auto ${isProfile ? "cursor-pointer" : ""}`}
        >
          <ProfileImg
            size="XL"
            edit={isProfile}
            src={
              preview ? preview : isProfile ? ProfileImgIcon : Basic_ProfileImg
            }
          />
        </label>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          id="image-upload"
          className="hidden"
          // {...register("api보고 결정")}
          onChange={imageChange}
          aria-label="프로필 이미지 업로드"
        />
      </section>
      <div
        className="items-center px-3 py-1 flex justify-center mb-2"
        onClick={() => navigate("/confirm")}
      >
        <p className="text-gy-700 body-rg-500 border-b w-fit cursor-pointer">
          기본 프로필 사용하기
        </p>
      </div>
      <div className="flex justify-center mb-4" onClick={handleClick}>
        <Btn_Static
          label={preview ? "다음" : "프로필 등록"}
          kind="GR400"
          size="L"
        />
      </div>

      {/* 이미지 모달 */}
      {isCropping && originalImage && (
        <div className="z-50 flex flex-col w-full inset-0  absolute bg-black ">
          {/* 크롭 영역 */}
          <div className="pb-130 relative ">
            <Cropper
              image={originalImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_: Area, areaPixels: Area) =>
                setCroppedAreaPixels(areaPixels)
              }
            />
          </div>

          {/* 푸터 */}
          <div className="flex justify-between items-center px-4 py-4 bg-black text-white relative z-10  ">
            <button onClick={() => setIsCropping(false)} className="text-sm">
              취소
            </button>
            <button
              disabled={isUploading}
              onClick={handleCropConfirm}
              className="text-sm"
            >
              {isUploading ? "업로드 " : "선택"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
