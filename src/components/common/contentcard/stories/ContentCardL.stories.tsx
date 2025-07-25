import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentCardL } from "../ContentCardL";

const meta: Meta<typeof ContentCardL> = {
  title: "Components/ContentCardL",
  component: ContentCardL,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // ✅ id argType 추가
    id: {
      control: "number",
      description: "콘텐츠 카드의 고유 ID",
    },
    isUserJoined: {
      control: "boolean",
      description: "사용자가 운동에 참여했는지 여부",
    },
    isGuestAllowedByOwner: {
      control: "boolean",
      description: "주최자가 게스트 초대를 허용했는지 여부",
    },
    isCompleted: {
      control: "boolean",
      description: "참여 완료인 경우에 버튼 비활성화",
    },
    title: { control: "text", description: "운동 제목" },
    date: { control: "text", description: "날짜 (예: 2024.07.08)" },
    location: { control: "text", description: "장소" },
    time: { control: "text", description: "시간 (예: 08:00 am ~ 10:00 am)" },
    femaleLevel: { control: "text", description: "여성 레벨 정보" },
    maleLevel: { control: "text", description: "남성 레벨 정보" },
    currentCount: { control: "number", description: "현재 참여 인원" },
    totalCount: { control: "number", description: "최대 참여 인원" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1, // ✅ id 추가
    isUserJoined: true,
    isGuestAllowedByOwner: true,
    isCompleted: false,
    title: "민턴콕콕 정기모임",
    date: "2024.07.08",
    location: "산성 실내 배드민턴장",
    time: "08:00 am ~ 10:00 am",
    femaleLevel: "전국 초심~준자강",
    maleLevel: "전국 준자강 이상",
    currentCount: 8,
    totalCount: 10,
  },
};

// 사용자가 참여하지 않은 상태 (게스트 초대 버튼 없음)
export const NotJoined: Story = {
  args: {
    ...Default.args,
    id: 2, // ✅ id 추가
    isUserJoined: false,
    isGuestAllowedByOwner: true,
    isCompleted: false,
    title: "새로운 배드민턴 모임",
    currentCount: 5,
    totalCount: 12,
  },
};

// 사용자가 참여했지만, 주최자가 게스트 초대를 허용하지 않은 상태 (게스트 초대 버튼 없음)
export const JoinedNoGuestAllowed: Story = {
  args: {
    ...Default.args,
    id: 3, // ✅ id 추가
    isUserJoined: true,
    isGuestAllowedByOwner: false,
    isCompleted: false,
    title: "클럽 내부 친선전",
    currentCount: 10,
    totalCount: 10,
  },
};

// 인원이 가득 찬 상태
export const FullCapacity: Story = {
  args: {
    ...Default.args,
    id: 4, // ✅ id 추가
    title: "마감된 모임",
    currentCount: 10,
    totalCount: 10,
  },
};

// 제목이 긴 경우
export const LongTitle: Story = {
  args: {
    ...Default.args,
    id: 5, // ✅ id 추가
    title: "아주아주아주아주 길고 긴 민턴콕콕 정기모임입니다",
  },
};

// 레벨 정보가 긴 경우
export const LongLevels: Story = {
  args: {
    ...Default.args,
    id: 6, // ✅ id 추가
    femaleLevel: "전국 초심~준자강 (경력 5년 이상)",
    maleLevel: "전국 준자강 이상 (경력 10년 이상)",
  },
};

export const Completed: Story = {
  args: {
    id: 7, // ✅ id 추가
    isUserJoined: true,
    isGuestAllowedByOwner: true,
    isCompleted: true,
    title: "민턴콕콕 정기모임",
    date: "2024.07.08",
    location: "산성 실내 배드민턴장",
    time: "08:00 am ~ 10:00 am",
    femaleLevel: "전국 초심~준자강",
    maleLevel: "전국 준자강 이상",
    currentCount: 8,
    totalCount: 10,
  },
};
