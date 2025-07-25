import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyPageMyGroupPage } from "../../../../pages/mypage/MyPageMyGroupPage";
import { MemoryRouter } from "react-router-dom";
import Kitty from "../../../../assets/images/kitty.png";

const meta: Meta<typeof MyPageMyGroupPage> = {
  title: "Pages/MyPage/MyGroupPage",
  component: MyPageMyGroupPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    groups: {
      description: "표시할 모임 목록이에요!",
      control: "object",
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

// ✅ 그룹이 여러 개 있을 때
export const Default: StoryObj<typeof MyPageMyGroupPage> = {
  args: {
    groups: [
      {
        id: 1,
        groupName: "신나는 배드민턴 모임",
        groupImage: Kitty,
        location: "강남구",
        femaleLevel: "초급",
        maleLevel: "중급",
        nextActivitDate: "2025-08-01",
        upcomingCount: 3,
        like: true,
        isMine: true,
      },
      {
        id: 2,
        groupName: "주말 등산 크루",
        groupImage: Kitty,
        location: "북한산",
        femaleLevel: "상급",
        maleLevel: "상급",
        nextActivitDate: "2025-08-03",
        upcomingCount: 2,
        like: false,
        isMine: false,
      },
      {
        id: 3,
        groupName: "독서 토론 클럽",
        groupImage: Kitty,
        location: "홍대입구",
        femaleLevel: "제한 없음",
        maleLevel: "제한 없음",
        nextActivitDate: "2025-08-05",
        upcomingCount: 1,
        like: false,
        isMine: true,
      },
    ],
  },
};

// ✅ 그룹이 하나도 없을 때
export const EmptyGroups: StoryObj<typeof MyPageMyGroupPage> = {
  args: {
    groups: [],
  },
};
