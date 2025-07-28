import type { Meta, StoryObj } from "@storybook/react-vite";
import { GroupChat } from "../GroupChat";
import Kitty from "../../../../assets/images/Profile_Image.png";

const meta = {
  title: "Components/GroupChat",
  component: GroupChat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    imageSrc: { control: "text", description: "채팅방 이미지 URL" },
    chatName: { control: "text", description: "채팅방 이름" },
    memberCount: { control: "number", description: "참여 인원 수" },
    lastMessage: { control: "text", description: "마지막 메시지 내용" },
    lastMessageTime: { control: "text", description: "마지막 메시지 시간" },
    unreadCount: { control: "number", description: "읽지 않은 메시지 수" },
  },
} satisfies Meta<typeof GroupChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: Kitty,
    chatName: "민턴콕콕",
    memberCount: 10,
    lastMessage: "오늘 운동 오실래요??",
    lastMessageTime: "10:00 am",
    unreadCount: 0,
  },
};

// 읽지 않은 메시지가 있는 상태의 GroupChat 스토리
export const UnreadMessages: Story = {
  args: {
    ...Default.args, // Default 스토리의 모든 props를 가져옴
    unreadCount: 3, // 읽지 않은 메시지
    lastMessage: "새로운 메시지가 도착했습니다! 확인해주세요.",
  },
};

// 마지막 메시지가 긴 상태의 GroupChat 스토리 (line-clamp-2 확인!!!)
export const LongMessage: Story = {
  args: {
    ...Default.args,
    lastMessage:
      "안녕하세요! 오랜만에 다 같이 모여서 즐거운 시간 보낼 수 있으면 좋겠습니다. 다들 시간 괜찮으신가요? 이번 주말에 다 같이 모여서 운동 한 번 할까요? 의견 남겨주세요!",
    unreadCount: 1,
  },
};

// 인원 수가 많은 채팅방 스토리
export const ManyMembers: Story = {
  args: {
    ...Default.args,
    chatName: "배드민턴 클럽 전체 공지방",
    memberCount: 99,
    lastMessage: "다음 주 정기 모임 관련 공지입니다. 필독해주세요!",
    unreadCount: 5,
  },
};
