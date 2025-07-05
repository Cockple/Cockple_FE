import type { Meta, StoryObj } from '@storybook/react';
import { MyPage } from '../MyPage';

const meta = {
  title: 'Components/MyPage', 
  component: MyPage, 
  parameters: {
    layout: 'centered', 
  },
  tags: ['autodocs'], 
  argTypes: {
    textLabel: { control: 'text', description: '첫 번째 섹션의 레이블 텍스트' },
    numberValue: { control: 'number', description: '첫 번째 섹션의 숫자 값' },
    totalMedalsCount: { control: 'number', description: '총 메달 개수' },
    goldMedals: { control: 'number', description: '금메달 개수' },
    silverMedals: { control: 'number', description: '은메달 개수' },
    bronzeMedals: { control: 'number', description: '동메달 개수' },
    disabled: { control: 'boolean', description: '컴포넌트 비활성화 여부' },
  },
} satisfies Meta<typeof MyPage>;

export default meta;
type Story = StoryObj<typeof meta>;


// 기본 (활성화) 상태
export const Default: Story = {
  args: {
    textLabel: "Text",
    numberValue: 5,
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
    textLabel: "Text",
    numberValue: 120,
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
    textLabel: "Text",
    numberValue: 0,
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
    textLabel: "Text",
    numberValue: 0,
    totalMedalsCount: 0,
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 0,
    disabled: true,
  },
};