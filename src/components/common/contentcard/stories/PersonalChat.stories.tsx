import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonalChat } from "../PersonalChat";
import ProfileImage from "../../../../assets/images/Profile_Image.png";

const meta = {
  title: "Components/PersonalChat",
  component: PersonalChat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    imageSrc: { control: "text", description: "프로필 이미지 URL" },
    userName: { control: "text", description: "사용자 이름" },
    lastMessage: { control: "text", description: "마지막 메시지 내용" },
    lastMessageTime: { control: "text", description: "마지막 메시지 시간" },
    unreadCount: { control: "number", description: "읽지 않은 메시지 수" },
  },
} satisfies Meta<typeof PersonalChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: ProfileImage,
    userName: "김소피아",
    lastMessage: "오늘 운동 오실래요??",
    lastMessageTime: "10:00 am",
    unreadCount: 0,
  },
};

export const UnreadMessages: Story = {
  args: {
    ...Default.args,
    unreadCount: 3,
    lastMessage: "새로운 메시지가 도착했습니다! 확인해주세요.",
  },
};

export const LongMessage: Story = {
  args: {
    ...Default.args,
    lastMessage:
      "안녕하세요! 오랜만에 다 같이 모여서 즐거운 시간 보낼 수 있으면 좋겠습니다. 다들 시간 괜찮으신가요? 이번 주말에 다 같이 모여서 운동 한 번 할까요? 의견 남겨주세요!",
    unreadCount: 1,
  },
};
