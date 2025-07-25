import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyPage_Medal } from "../MyPage_Medal";

const meta = {
  title: "Components/MyPage_Medal",
  component: MyPage_Medal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    myMedalTotal: { control: "number", description: "총 메달 개수" },
    goldCount: { control: "number", description: "금메달 개수" },
    silverCount: { control: "number", description: "은메달 개수" },
    bronzeCount: { control: "number", description: "동메달 개수" },
    disabled: { control: "boolean", description: "컴포넌트 비활성화 여부" },
  },
} satisfies Meta<typeof MyPage_Medal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (활성화) 상태
export const Default: Story = {
  args: {
    myMedalTotal: 3,
    goldCount: 1,
    silverCount: 1,
    bronzeCount: 1,
    disabled: false,
  },
};

// 메달이 많은 상태
export const ManyMedals: Story = {
  args: {
    myMedalTotal: 25,
    goldCount: 10,
    silverCount: 8,
    bronzeCount: 7,
    disabled: false,
  },
};

// 메달이 없는 상태
export const NoMedals: Story = {
  args: {
    myMedalTotal: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    disabled: false,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    myMedalTotal: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    disabled: true,
  },
};
