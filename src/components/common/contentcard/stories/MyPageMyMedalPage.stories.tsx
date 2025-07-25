import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import kitty from "../../../../assets/images/kitty.png";
import { MyPageMyMedalPage } from "../../../../pages/mypage";

const meta: Meta<typeof MyPageMyMedalPage> = {
  title: "Pages/MyPage/MyMedalPage",
  component: MyPageMyMedalPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text", description: "사용자 이름" },
    gender: { control: "text", description: "사용자 성별" },
    group: { control: "text", description: "사용자 그룹/소속" },
    birth: { control: "text", description: "사용자 생년월일" },
    imageSrc: { control: "text", description: "사용자 프로필 이미지 URL" },
    myMedalTotal: { control: "number", description: "총 메달 개수" },
    goldCount: { control: "number", description: "금메달 개수" },
    silverCount: { control: "number", description: "은메달 개수" },
    bronzeCount: { control: "number", description: "동메달 개수" },
    disabled: { control: "boolean", description: "메달 섹션 비활성화 여부" },
    medals: { control: "object", description: "메달 목록" },
  },
  // 🚀 PageHeader 컴포넌트가 useNavigate()를 사용하기 때문에 MemoryRouter가 필요해!
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

//임사값
export const Default: StoryObj<typeof MyPageMyMedalPage> = {
  args: {
    name: "김메달",
    gender: "여",
    group: "운동 크루",
    birth: "2000.01.01",
    imageSrc: kitty,
    myMedalTotal: 5,
    goldCount: 2,
    silverCount: 1,
    bronzeCount: 2,
    medals: [
      {
        title: "2024년 동네 마라톤 대회",
        date: "2024.05.10",
        medalImageSrc: kitty, // 금메달 이미지
        isAwarded: true, // 입상
      },
      {
        title: "주말 배드민턴 친선전",
        date: "2024.06.15",
        medalImageSrc: kitty, // 은메달 이미지
        isAwarded: true, // 입상
      },
      {
        title: "우리 동네 농구 리그",
        date: "2024.07.01",
        medalImageSrc: kitty, // 동메달 이미지
        isAwarded: true, // 입상
      },
      {
        title: "새벽 조깅 챌린지",
        date: "2024.07.08",
        medalImageSrc: kitty, // 미입상 이미지
        isAwarded: false, // 미입상 기록
      },
      {
        title: "수영장 자유형 기록 측정",
        date: "2024.07.12",
        medalImageSrc: kitty, // 미입상 이미지
        isAwarded: false, // 미입상 기록
      },
    ],
  },
};

//메달이 하나도 없을 때
export const EmptyMedals: StoryObj<typeof MyPageMyMedalPage> = {
  args: {
    ...Default.args,
    myMedalTotal: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    medals: [], // 메달 목록이 비어있음
  },
};
// 모든 메달이 입상 기록일 때
export const AllAwardedMedals: StoryObj<typeof MyPageMyMedalPage> = {
  args: {
    ...Default.args,
    myMedalTotal: 3,
    goldCount: 1,
    silverCount: 1,
    bronzeCount: 1,
    medals: [
      {
        title: "전국 탁구 대회",
        date: "2023.11.20",
        medalImageSrc: kitty,
        isAwarded: true,
      },
      {
        title: "지역 볼링 대회",
        date: "2024.03.05",
        medalImageSrc: kitty,
        isAwarded: true,
      },
      {
        title: "회사 체육대회",
        date: "2024.04.22",
        medalImageSrc: kitty,
        isAwarded: true,
      },
    ],
  },
};

// 모든 메달이 미입상 기록일 때 (미입상 기록 탭 테스트 용이)
export const AllUnawardedMedals: StoryObj<typeof MyPageMyMedalPage> = {
  args: {
    ...Default.args,
    myMedalTotal: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    medals: [
      {
        title: "새벽 조깅 챌린지",
        date: "2024.07.08",
        medalImageSrc: kitty,
        isAwarded: false,
      },
      {
        title: "수영장 자유형 기록 측정",
        date: "2024.07.12",
        medalImageSrc: kitty,
        isAwarded: false,
      },
      {
        title: "헬스장 벤치프레스 도전",
        date: "2024.07.14",
        medalImageSrc: kitty,
        isAwarded: false,
      },
    ],
  },
};
