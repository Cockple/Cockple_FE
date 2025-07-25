import type { Meta, StoryObj } from '@storybook/react';
import { MyPageMyExercisePage } from '../../../../pages/mypage/MyPageMyExercisePage'; 
import { MemoryRouter } from 'react-router-dom'; 

const meta: Meta<typeof MyPageMyExercisePage> = {
  title: 'Pages/MyPage/MyExercisePage', 
  component: MyPageMyExercisePage, 
  parameters: {
    layout: 'fullscreen', 
  },
  tags: ['autodocs'], 
  argTypes: {
    myActivityCount: {
      description: '표시할 내 운동 활동 목록이에요!',
      control: 'object',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof MyPageMyExercisePage> = {
  args: {
    myActivityCount: [
      {
        isUserJoined: true, 
        isGuestAllowedByOwner: false,
        isCompleted: false, 
        title: '아침 조깅 모임',
        date: '2025.07.15',
        day: '화',
        location: '올림픽공원',
        time: '07:00',
        femaleLevel: '초급',
        maleLevel: '초급',
        currentPeople: 3,
        maxPeople: 5,
      },
      {
        isUserJoined: true,
        isGuestAllowedByOwner: true, 
        isCompleted: false,
        title: '저녁 요가 클래스',
        date: '2025.07.16',
        day: '수',
        location: '우리 동네 요가원',
        time: '19:00',
        femaleLevel: '중급',
        maleLevel: '중급',
        currentPeople: 8,
        maxPeople: 10,
      },
      {
        isUserJoined: true,
        isGuestAllowedByOwner: false,
        isCompleted: true,
        title: '주말 농구 게임',
        date: '2025.07.13',
        day: '일',
        location: '강변 농구 코트',
        time: '14:00',
        femaleLevel: '제한 없음',
        maleLevel: '상급',
        currentPeople: 10,
        maxPeople: 10,
      },
      {
        isUserJoined: true,
        isGuestAllowedByOwner: true,
        isCompleted: false,
        title: '새벽 수영 강습',
        date: '2025.07.17',
        day: '목',
        location: '시립 수영장',
        time: '06:00',
        femaleLevel: '초급',
        maleLevel: '초급',
        currentPeople: 6,
        maxPeople: 8,
      },
    ],
  },
};

// 내 모임 X
export const EmptyActivities: StoryObj<typeof MyPageMyExercisePage> = {
  args: {
    myActivityCount: [], 
  },
};