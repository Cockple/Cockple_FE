import type { Meta, StoryObj } from '@storybook/react';
import { Group_S } from '../Group_S';
import Kitty from "../../../../assets/images/kitty.png"; 

const meta = {
  title: 'Components/Group_S', 
  component: Group_S,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'], 
  argTypes: {
    title: { control: 'text', description: '그룹 이름' },
    location: { control: 'text', description: '지역 정보' },
    imageSrc: { control: 'text', description: '그룹 이미지 URL' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
  },
} satisfies Meta<typeof Group_S>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "민턴클로버",
    location: "경기도 / 성남시",
    imageSrc: Kitty, 
    disabled: false, 
  },
};

// 비활성화 상태의 Group_S 스토리
export const Disabled: Story = {
  args: {
    title: "민턴클로버", 
    location: "경기도 / 성남시",
    imageSrc: Kitty,
    disabled: true, 
  },
};

