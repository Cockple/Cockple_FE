import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div
      className="w-full flex flex-col items-center gap-5 pt-8 pb-40 bg-gy-50"
      style={{ width: "calc(100% + 2rem)" }}
    >
      <div className="flex flex-col gap-1 body-sm-400 text-gy-500">
        <Link
          to={
            "https://www.instagram.com/cockple_official/?igsh=MWk3azl2dGQ1dXdreQ%3D%3D&utm_source=qr#"
          }
        >
          UMC 8th Ain : 콕플
        </Link>
        <span>@COCKPLE. All Rights Reserved.</span>
      </div>

      <div></div>
    </div>
  );
};
