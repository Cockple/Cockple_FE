import HomeIcon from "@/assets/icons/home.svg";
import HomeIconFilled from "@/assets/icons/home_filled.svg";
import GroupIcon from "@/assets/icons/collections.svg";
import GroupIconFilled from "@/assets/icons/collections_filled.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import ChatIconFilled from "@/assets/icons/chat_filled.svg";
import HeartBlackIcon from "@/assets/icons/heart_black.svg";
import HeartIconFilled from "@/assets/icons/heart_filled.svg";
import MypageIcon from "@/assets/icons/mypage.svg";
import MypageIconFilled from "@/assets/icons/mypage_filled.svg";
import { NavItem } from "./NavItem";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "홈",
    icon: {
      filled: HomeIconFilled,
      outline: HomeIcon,
    },
    path: "/",
  },
  {
    label: "모임",
    icon: {
      filled: GroupIconFilled,
      outline: GroupIcon,
    },
    path: "/group",
  },
  {
    label: "채팅",
    icon: {
      filled: ChatIconFilled,
      outline: ChatIcon,
    },
    path: "/chat",
  },
  {
    label: "찜",
    icon: {
      filled: HeartIconFilled,
      outline: HeartBlackIcon,
    },
    path: "/liked",
  },
  {
    label: "마이페이지",
    icon: {
      filled: MypageIconFilled,
      outline: MypageIcon,
    },
    path: "/mypage",
  },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed w-full max-w-[444px] bottom-0 -ml-4 flex px-4 pt-2 pb-8 justify-between box-border bg-white shadow-ds50">
      {NAV_ITEMS.map(item => {
        const isActive = location.pathname === item.path;
        const IconComponent = isActive ? item.icon.filled : item.icon.outline;
        return (
          <NavItem
            key={item.label}
            label={item.label}
            icon={IconComponent}
            active={isActive}
            onClick={() => navigate(item.path)}
          />
        );
      })}
    </nav>
  );
};
