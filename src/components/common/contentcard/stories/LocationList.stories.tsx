import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocationList } from "../LocationList";

const meta = {
  title: "Components/LocationList",
  component: LocationList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isMainAddr: { control: "text", description: "메인 주소" },
    streetAddr: { control: "text", description: "서브 주소" },
    showOnMapText: { control: "text", description: "지도에서 보기 텍스트" },
    disabled: { control: "boolean", description: "비활성화 여부" },
    initialClicked: { control: "boolean", description: "초기 클릭 상태" },
    onClick: { action: "clicked", description: "클릭 이벤트 콜백" },
  },
} satisfies Meta<typeof LocationList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (활성화, 클릭되지 않음) 상태
export const Default: Story = {
  args: {
    id: 1,
    isMainAddr: "우헿헤 배드민턴장",
    streetAddr: "서울시 강남구 테헤란로 123",
    showOnMapText: "지도에서 보기",
    disabled: false,
    initialClicked: false,
  },
};

// 클릭된 상태 (초기값으로 클릭 상태를 설정)
export const Clicked: Story = {
  args: {
    ...Default.args,
    isMainAddr: "선택된 배드민턴장",
    initialClicked: true,
  },
};

// 비활성화 상태 (클릭 불가)
export const Disabled: Story = {
  args: {
    ...Default.args,
    isMainAddr: "비활성화된 배드민턴장",
    disabled: true, // 비활성화
  },
};

// 텍스트가 긴 경우 (줄바꿈이나 ellipsis 확인)
export const LongAddress: Story = {
  args: {
    ...Default.args,
    isMainAddr: "헤헤헤헤ㅔ아아아아하하ㅏ핳 ㅏ안 끝나ㅏ하하ㅏ하ㅏ",
    streetAddr:
      "서울시 강남구 테헤란로 123번길 45-67 아주아주아주아주아주아주아주아주아주 긴 주소입니다",
  },
};
