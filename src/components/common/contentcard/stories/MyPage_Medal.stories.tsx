import type { Meta, StoryObj } from '@storybook/react';
import { MyPage_Medal } from '../MyPage_Medal';

const meta = {
  title: 'Components/MyPage_Medal', 
  component: MyPage_Medal, 
  parameters: {
    layout: 'centered', 
  },
  tags: ['autodocs'], 
  argTypes: {
    totalMedalsCount: { control: 'number', description: '총 메달 개수' },
    goldMedals: { control: 'number', description: '금메달 개수' },
    silverMedals: { control: 'number', description: '은메달 개수' },
    bronzeMedals: { control: 'number', description: '동메달 개수' },
    disabled: { control: 'boolean', description: '컴포넌트 비활성화 여부' },
  },
} satisfies Meta<typeof MyPage_Medal>;

export default meta;
type Story = StoryObj<typeof meta>;


// 기본 (활성화) 상태
export const Default: Story = {
  args: {
    totalMedalsCount: 3,
    goldMedals: 1,
    silverMedals: 1,
    bronzeMedals: 1,
    disabled: false,
  },
};

// 메달이 많은 상태
export const ManyMedals: Story = {
  args: {
    totalMedalsCount: 25,
    goldMedals: 10,
    silverMedals: 8,
    bronzeMedals: 7,
    disabled: false,
  },
};

// 메달이 없는 상태
export const NoMedals: Story = {
  args: {
    totalMedalsCount: 0,
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 0,
    disabled: false,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    totalMedalsCount: 0,
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 0,
    disabled: true,
  },
};