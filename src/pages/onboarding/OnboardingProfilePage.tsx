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

export const OnboardingProfilePage = () => {
  const [setProfile, setIsProfile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  //crop라이브러리
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleClick = () => {
    if (setProfile) {
      navigate("/confirm");
    } else {
      setIsProfile(true);
    }
  };

  useEffect(() => {
    // console.log(preview);
  }, [preview]);
  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setIsCropping(true);
      // fileInput.current = file;
    }
  };

  const getCroppedImg = (
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

  return (
    <div
      className={` flex flex-col relative -mb-8 min-h-[100dvh] pt-14 ${isCropping ? "-mx-4" : ""}`}
      style={{ maxWidth: "444px" }}
    >
      <PageHeader title="회원 정보 입력" />
      {isCropping ? "" : <ProgressBar width={setProfile ? "96" : "76"} />}
      <section className=" flex flex-col gap-[6.25rem] text-left pb-34 mb-[3px] ">
        <div>
          <IntroText
            title="프로필을 등록해주세요."
            text1="내 모습을 보여주면,"
            text2="모임에서 더 빠르게 친해질 수 있어요!"
            isBar={true}
          />
        </div>
        <label
          htmlFor={setProfile ? "image-upload" : ""}
          className={`w-fit  mx-auto ${setProfile ? "cursor-pointer" : ""}`}
        >
          <ProfileImg
            size="XL"
            edit={setProfile}
            src={
              preview ? preview : setProfile ? ProfileImgIcon : Basic_ProfileImg
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
      <div className="flex justify-center" onClick={handleClick}>
        <Btn_Static label="다음" kind="GR400" size="L" />
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
              onClick={async () => {
                if (!originalImage || !croppedAreaPixels) return;
                const cropped = await getCroppedImg(
                  originalImage,
                  croppedAreaPixels,
                );
                setPreview(cropped);
                setIsProfile(true);
                setIsCropping(false);
              }}
              className="text-sm"
            >
              선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
