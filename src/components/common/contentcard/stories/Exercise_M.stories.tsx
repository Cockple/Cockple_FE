import type { Meta, StoryObj } from "@storybook/react-vite";
import { Exercise_M } from "../Exercise_M";
import Kitty from "../../../../assets/images/kitty.png";

const meta = {
  title: "Components/Exercise_M",
  component: Exercise_M,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "운동 제목" },
    date: { control: "text", description: "운동 날짜" },
    time: { control: "text", description: "운동 시간" },
    location: { control: "text", description: "운동 장소" },
    imageSrc: { control: "text", description: "운동 이미지 URL" },
    isFavorite: { control: "boolean", description: "찜 여부" },
  },
} satisfies Meta<typeof Exercise_M>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    title: "하이콕콕",
    date: "2000.05.01 (월)",
    time: "08:00 am ~ 10:00 am",
    location: "산성 실내 배드민턴장",
    imageSrc: Kitty,
    isFavorite: false,
  },
};

export const Favorite: Story = {
  args: {
    ...Default.args, // Default 스토리의 모든 props를 가져오고
    isFavorite: true, // isFavorite만 true로 변경
  },
};
