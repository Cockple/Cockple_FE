import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div
      className="w-full flex flex-col items-center gap-5 pt-8 pb-14 bg-gy-50 body-sm-400 text-gy-500"
      style={{ width: "calc(100% + 2rem)" }}
    >
      <div className="flex flex-col gap-1">
        <span>UMC 8th Ain : 콕플</span>
        <span>@COCKPLE. All Rights Reserved.</span>
      </div>

      <Link
        to={
          "https://www.instagram.com/cockple_official/?igsh=MWk3azl2dGQ1dXdreQ%3D%3D&utm_source=qr#"
        }
        className="px-2 py-1 underline"
      >
        Contact COCKPLE
      </Link>
    </div>
  );
};
