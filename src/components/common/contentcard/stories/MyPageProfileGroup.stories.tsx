import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyPageProfileGroup } from "../../../../pages/mypage/MyPageProfileGroup";
import { MemoryRouter } from "react-router-dom";
import kitty from "../../../../assets/images/kitty.png";

const meta: Meta<typeof MyPageProfileGroup> = {
  title: "Pages/MyPage/MyPageProfileGroup",
  component: MyPageProfileGroup,
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

export const Default: StoryObj<typeof MyPageProfileGroup> = {
  args: {
    groups: [
      {
        id: 1,
        groupName: "신나는 배드민턴 모임",
        location: "강남구",
        femaleLevel: "초급",
        maleLevel: "중급",
        // summary: "배드민턴으로 스트레스 날려버릴 사람 모여라!",
        groupImage: kitty,
        like: true,
        nextActivitDate: "2024-06-15",
        upcomingCount: 2,
        isMine: true,
      },
      {
        id: 2,
        groupName: "주말 등산 크루",
        location: "북한산",
        femaleLevel: "상급",
        maleLevel: "상급",
        // summary: "주말에 함께 산을 오르며 건강도 챙기고 힐링도 해요!",
        groupImage: kitty,
        like: false,
        nextActivitDate: "2024-06-20",
        upcomingCount: 1,
        isMine: false,
      },
      {
        id: 3,
        groupName: "독서 토론 클럽",
        location: "홍대입구",
        femaleLevel: "제한 없음",
        maleLevel: "제한 없음",
        // summary: "매주 흥미로운 책을 읽고 생각을 나누는 모임이에요.",
        groupImage: kitty,
        like: true,
        nextActivitDate: "2024-06-18",
        upcomingCount: 3,
        isMine: true,
      },
    ],
  },
};

export const EmptyGroups: StoryObj<typeof MyPageProfileGroup> = {
  args: {
    groups: [],
  },
};
