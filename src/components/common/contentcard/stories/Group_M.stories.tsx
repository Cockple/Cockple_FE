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
    title: { control: 'text', description: '그룹 이름' },
    location: { control: 'text', description: '지역 정보' },
    femaleLevel: { control: 'text', description: '여성 회원 레벨' },
    maleLevel: { control: 'text', description: '남성 회원 레벨' },
    summary: { control: 'text', description: '활동 요약 정보' },
    imageSrc: { control: 'text', description: '그룹 이미지 URL' },
    isFavorite: { control: 'boolean', description: '찜 여부' },
  },
} satisfies Meta<typeof Group_M>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "민턴클로버",
    location: "경기도/성남시",
    femaleLevel: "전국 초심~준자강",
    maleLevel: "전국 준자강 이상",
    summary: "05.01 오전 운동 • 운동 5개 진행 예정",
    imageSrc: Kitty, 
    isFavorite: false, 
  },
};

// 찜한 상태의 Group_M 스토리
export const Favorite: Story = {
  args: {
    ...Default.args, // Default 스토리의 모든 props를 가져옴
    isFavorite: true, // isFavorite만 true로 변경
  },
};

