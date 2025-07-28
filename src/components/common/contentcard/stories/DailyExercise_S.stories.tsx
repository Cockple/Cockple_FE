import type { Meta, StoryObj } from "@storybook/react-vite";
import { DailyExercise_S } from "../DailyExercise_S";
import Kitty from "../../../../assets/images/kitty.png";

const meta = {
  title: "Components/DailyExercise_S",
  component: DailyExercise_S,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"], //문서화
  argTypes: {
    title: { control: "text", description: "운동 제목" },
    location: { control: "text", description: "운동 장소" },
    time: { control: "text", description: "운동 시간" },
    imageSrc: { control: "text", description: "이미지 파일 경로 또는 URL" },
  },
} satisfies Meta<typeof DailyExercise_S>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "민턴콕콕",
    location: "산성 실내 배드민턴장",
    time: "08:00 am ~ 10:00 am",
    imageSrc: Kitty,
  },
  decorators: [
    Story => (
      <div style={{ width: "375px", height: "812px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
};
