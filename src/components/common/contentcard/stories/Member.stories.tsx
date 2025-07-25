// Member.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Member } from "../Member";

const meta = {
  title: "Components/Member",
  component: Member,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: {
        type: "select",
        options: ["Participating", "waiting", "invite", "request", "approved"],
      },
      description: "회원 상태",
    },
    name: { control: "text", description: "회원 이름" },
    gender: {
      control: { type: "select", options: ["male", "female"] },
      description: "성별",
    },
    // group: { control: "text", description: "소속 그룹" },
    birth: {
      control: "text",
      description: "생년월일",
      table: { defaultValue: { summary: "-" } },
    },
    showStar: { control: "boolean", description: "별 아이콘 표시 여부" },
    isGuest: { control: "boolean", description: "게스트 여부" },
    guestName: { control: "text", description: "게스트 이름" },
    onAccept: { action: "수락 클릭" },
    onReject: { action: "거절 클릭" },
  },
} satisfies Meta<typeof Member>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Participating: Story = {
  args: {
    status: "Participating",
    name: "김셰익스피어",
    gender: "female",
    level: "전국 D조",
    showStar: true,
    isGuest: true,
    guestName: "김알렉산드라 게스트",
  },
};

export const Waiting: Story = {
  args: {
    status: "waiting",
    name: "이문세",
    gender: "male",
    level: "전국 A조",
  },
};

export const Invite: Story = {
  args: {
    status: "invite",
    name: "홍길동",
    gender: "male",
    level: "전국 Z조",
  },
};

export const Request: Story = {
  args: {
    status: "request",
    name: "윤동주",
    gender: "male",
    level: "전국 B조",
    birth: "1999.12.31",
  },
};

export const Approved: Story = {
  args: {
    status: "approved",
    name: "김소월",
    gender: "female",
    level: "전국 C조",
    birth: "1995.01.01",
  },
};
