import type { Meta, StoryObj } from '@storybook/react';
import { MyPage } from '../../../../pages/mypage/MyPage'; 
import { MemoryRouter } from 'react-router-dom';


const createMockFile = (url: string, filename: string, mimeType: string): File => {
  
  const blob = new Blob([''], { type: mimeType }); 
  const mockFile = blob as File;
  Object.defineProperty(mockFile, 'name', { value: filename });
  Object.defineProperty(mockFile, 'lastModified', { value: Date.now() });
  Object.defineProperty(mockFile, 'size', { value: blob.size });

  return mockFile;
};
// File처리를 해야해서 StringX
const mockProfileImageFile = createMockFile(
  
  '../../../../assets/images/kitty.png',
  '../../../../assets/images/kitty.png',
  '../../../../assets/images/kitty.png',
);

const meta = {
  title: 'Pages/MyPage/MyPage',
  component: MyPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: '사용자 이름' },
    gender: { control: 'select', options: ['female', 'male'], description: '성별' },
    level: { control: 'text', description: '사용자 급수/레벨' },
    birth: { control: 'text', description: '생년월일' },
    profileImage: { control: 'object', description: '프로필 이미지 File 객체' }, 

    myMedalTotal: { control: 'number', description: '총 메달 개수' },
    goldCount: { control: 'number', description: '금메달 개수' },
    silverCount: { control: 'number', description: '은메달 개수' },
    bronzeCount: { control: 'number', description: '동메달 개수' },
    disabled: { control: 'boolean', description: '메달 섹션 비활성화 여부' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof MyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// 🌟 기본 사용자 프로필 (메달 포함)
export const DefaultUser: Story = {
  args: {
    name: "김알렉산드라",
    gender: "female",
    level: "전국 D조",
    birth: "2000.03.12",
    profileImage: mockProfileImageFile,
    myMedalTotal: 3,
    goldCount: 1,
    silverCount: 1,
    bronzeCount: 1,
    disabled: false,
  },
};

// 😥 메달이 없는 사용자 프로필
export const UserNoMedals: Story = {
  args: {
    ...DefaultUser.args,
    myMedalTotal: 0, 
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
  },
};

// 🚫 메달 섹션이 비활성화된 사용자 프로필
export const DisabledMedalSection: Story = {
  args: {
    ...DefaultUser.args,
    disabled: true,
  },
};

// 🌟 남성 사용자 프로필 예시
export const MaleUser: Story = {
  args: {
    ...DefaultUser.args,
    name: "이철수",
    gender: "male",
    level: "지역 A조",
    profileImage: createMockFile('https://via.placeholder.com/150/87CEEB/FFFFFF?text=MaleProfile', 'male_profile.png', 'image/png'),
    myMedalTotal: 5,
    goldCount: 2,
    silverCount: 2,
    bronzeCount: 1,
  },
};