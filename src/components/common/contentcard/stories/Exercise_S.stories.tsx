import type { Meta, StoryObj } from "@storybook/react-vite";
import { Exercise_S } from "../Exercise_S";
import Kitty from "../../../../assets/images/kitty.png";

const meta = {
  title: "Components/Exercise_S",
  component: Exercise_S,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "운동 제목" },
    date: { control: "text", description: "운동 날짜 (예: 04.04 (월))" },
    time: { control: "text", description: "운동 시간 (예: 04:00 am)" },
    location: { control: "text", description: "운동 장소" },
    imageSrc: { control: "text", description: "이미지 파일 경로 또는 URL" },
  },
} satisfies Meta<typeof Exercise_S>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "민턴클로버",
    date: "04.04 (월)",
    time: "04:00 am",
    location: "산성 실내 배드민턴장",
    imageSrc: Kitty,
  },
};
