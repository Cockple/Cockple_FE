import type { Meta, StoryObj } from '@storybook/react';
import { Group_M } from '../Group_M';
import Kitty from "../../../../assets/images/kitty.png"; 

const meta = {
  title: 'Components/Group_M', 
  component: Group_M, 
  parameters: {
    layout: 'centered', 
  },
  tags: ['autodocs'],
  argTypes: {
    // 🚀 변경된 props 이름에 맞춰 argTypes 수정!
    id: { control: 'number', description: '모임의 고유 ID' },
    groupName: { control: 'text', description: '모임 이름' },
    location: { control: 'text', description: '지역 정보' },
    femaleLevel: { control: 'text', description: '여성 회원 레벨' },
    maleLevel: { control: 'text', description: '남성 회원 레벨' },
    nextActivitDate: { control: 'text', description: '다음 활동 날짜 (예: 05.01 오전 운동)' },
    upcomingCount: { control: 'number', description: '예정된 활동 개수 (예: 5)' },
    groupImage: { control: 'text', description: '모임 이미지 URL' },
    like: { control: 'boolean', description: '찜 여부' }, // isFavorite -> like로 변경
    onToggleFavorite: { action: 'onToggleFavorite', description: '찜 토글 시 호출되는 함수' }, // 함수 타입은 action으로!
    isMine : { control: 'text', description: '내가 만든 모임인지' },
  },
} satisfies Meta<typeof Group_M>;

export default meta;
type Story = StoryObj<typeof meta>;

// 🌟 기본 모임 (찜 안 된 상태)
export const Default: Story = {
  args: {
    id: 1, // 🚀 id 추가
    groupName: "민턴클로버", // 🚀 title -> groupName
    location: "경기도/성남시",
    femaleLevel: "전국 초심~준자강",
    maleLevel: "전국 준자강 이상",
    nextActivitDate: "05.01 오전 운동", // 🚀 summary -> nextActivitDate
    upcomingCount: 5, // 🚀 summary -> upcomingCount
    groupImage: Kitty, // 🚀 imageSrc -> groupImage
    like: false, // 🚀 isFavorite -> like
  },
};

// 찜한 상태의 모임
export const Liked: Story = { // 🚀 Favorite -> Liked로 이름 변경 (더 명확하게)
  args: {
    ...Default.args, // Default 스토리의 모든 props를 가져옴
    id: 2, // 🚀 id는 고유해야 하므로 변경 (또는 Default와 동일해도 무방)
    like: true, // 🚀 like만 true로 변경
  },
};

// 🚀 긴 텍스트가 있는 모임 (truncate 확인용)
export const LongText: Story = {
  args: {
    ...Default.args,
    id: 3,
    groupName: "아주아주아주아주아주아주아주아주아주아주아주아주아주 긴 모임 이름",
    location: "서울시 강남구 테헤란로 12345번지 아주아주 긴 주소",
    femaleLevel: "전국 초심부터 준자강까지 모든 레벨 환영합니다",
    maleLevel: "전국 준자강 이상 상급자들만 모이는 아주 어려운 모임",
    nextActivitDate: "2025.12.31 오후 11시 59분 59초에 시작하는 아주 긴 활동",
  },
};