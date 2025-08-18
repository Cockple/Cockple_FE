import React from "react";
import classNames from "classnames";

interface ImageBoxProps {
  imageSrc?: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const ImageBox = ({
  imageSrc,
  disabled = false,
  isSelected,
  onClick,
}: ImageBoxProps) => {
  const [isPressing, setIsPressing] = React.useState(false);

  if (disabled) {
    return (
      <div
        className={classNames(
          "w-27 h-[7.5rem] bg-white py-6 px-3 rounded-xl shadow-ds100 border border-transparent opacity-50 pointer-events-none cursor-not-allowed",
        )}
      >
       <div className="w-[5.5rem] h-[5.5rem] flex items-center justify-center rounded-md transition-colors duration-150">
          {imageSrc && typeof imageSrc === "string" && (
            <img src={imageSrc} alt="preview" className="w-full h-full object-cover rounded-md" />
          )}
          {imageSrc && typeof imageSrc !== "string" && React.createElement(imageSrc)}
        </div>
      </div>
    );
  }

  const handleMouseDown = () => setIsPressing(true);
  const handleMouseEnd = () => setIsPressing(false);

  return (
    <div
      className={classNames(
        "w-27 h-[7.5rem] py-4 px-2 rounded-xl shadow-ds100 border transition-colors duration-150 cursor-pointer select-none",
        {
          "bg-[#F4F5F6]": isPressing,
          "bg-white": !isPressing,
          "border-1 border-[#0B9A4E]": isSelected,
          "border-transparent": !isSelected,
        },
      )}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseEnd}
      onMouseLeave={handleMouseEnd}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseEnd}
    >
      <div className="w-[5.5rem] h-[5.5rem]  flex items-center justify-center rounded-md transition-colors duration-150">
        {imageSrc && typeof imageSrc === "string" && (
          <img
            src={imageSrc}
            alt="preview"
            className="w-full h-full object-cover rounded-md"
          />
        )}
        {imageSrc && typeof imageSrc !== "string" && React.createElement(imageSrc)}
      </div>
    </div>
  );
};
