import type { Meta, StoryObj } from "@storybook/react";
import { MyPage_Text } from "../MyPage_Text";

const meta: Meta<typeof MyPage_Text> = {
  title: "Components/MyPage_Text",
  component: MyPage_Text,
  tags: ["autodocs"],
  argTypes: {
    textLabel: { control: "text" },
    numberValue: { control: "number" },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof MyPage_Text>;

export const Default: Story = {
  args: {
    textLabel: "운동 횟수",
    numberValue: 12,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    textLabel: "운동 횟수",
    numberValue: 12,
    disabled: true,
  },
};

export const PressingState: Story = {
  render: (args) => {
    // 강제로 pressing 상태 보여주기 위해 커스텀 렌더러 사용 가능
    return <MyPage_Text {...args} />;
  },
  args: {
    textLabel: "운동 횟수",
    numberValue: 12,
    disabled: false,
  },
};
