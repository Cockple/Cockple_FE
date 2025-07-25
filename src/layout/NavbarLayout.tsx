import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/system/navbar/Navbar";
import { MainHeader } from "../components/common/system/header/MainHeader";

export const NavbarLayout = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div className="h-full">
      {pathname !== "/" && <MainHeader />}
      <div className="h-full pb-26 pt-14">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
};
