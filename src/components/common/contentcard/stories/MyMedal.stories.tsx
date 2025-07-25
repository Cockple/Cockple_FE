import type { Meta, StoryObj } from '@storybook/react';
import { MyMedal } from '../MyMedal';
import MedalPlaceholder from "../../../../assets/images/kitty.png"; 

const meta = {
  title: 'Components/MyMedal', 
  component: MyMedal, 
  parameters: {
    layout: 'centered', 
  },
  tags: ['autodocs'], 
  argTypes: {
    title: { control: 'text', description: '대회/메달 이름' },
    date: { control: 'text', description: '획득 날짜' },
    medalImageSrc: { control: 'text', description: '메달 이미지 URL' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
  },
} satisfies Meta<typeof MyMedal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (활성화) 상태의 MyMedal 스토리 
export const Default: Story = {
  args: {
    title: "라이더 찐 배린이대회 / 여복 D조 우승",
    date: "2000. 01. 01",
    medalImageSrc: MedalPlaceholder, 
    disabled: false, 
  },
};

// 제목이 긴 경우의 스토리 
export const LongTitle: Story = {
  args: {
    ...Default.args, 
    title: "아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주 긴 대회 이름입니다",
  },
};

// 비활성화 상태의 MyMedal 스토리
export const Disabled: Story = {
  args: {
    ...Default.args,
    title: "비활성화된 대회",
    disabled: true,
  },
};
