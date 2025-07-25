// 채팅창에서 보낸 이미지 클릭시 띄워지는 모달창
import GY800_M from "../common/Btn_Static/Icon_Btn/GY800_M_Icon";

// 아이콘
import DownLoad from "../../assets/icons/download.svg";
import Dismiss from "../../assets/icons/dismiss_gy800.svg";
import { useIsStandalone } from "../../hooks/useIsStandalone";

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal = ({ imageUrl, onClose }: ImagePreviewModalProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "";
    link.click();
  };

  const isStandalone = useIsStandalone();

  return (
    <div className="absolute inset-0 z-50 flex justify-center items-center bg-black-60">
      <div className="flex flex-col gap-[0.625rem]">
        {/* 상단 버튼 (오른쪽 상단에 고정) */}
        <div className="flex justify-end w-full gap-4">
          <GY800_M
            iconMap={{
              disabled: DownLoad,
              default: DownLoad,
              pressing: DownLoad,
              clicked: DownLoad,
            }}
            onClick={handleDownload}
          />
          <GY800_M
            iconMap={{
              disabled: Dismiss,
              default: Dismiss,
              pressing: Dismiss,
              clicked: Dismiss,
            }}
            onClick={onClose}
          />
        </div>

        {/* 이미지 프리뷰 */}
        <img
          src={imageUrl}
          alt="preview"
          className={`${isStandalone ? "max-h-[40rem]" : "max-h-[35rem]"} object-contain rounded-lg shadow-lg`}
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
