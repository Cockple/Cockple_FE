import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/login/LoginPage";
import { ChatPage } from "./pages/chat/ChatPage";
import { LikedPage } from "./pages/like/LikedPage";
import { PrivateRoute } from "./layout/PrivateRoute";
import { NavbarLayout } from "./layout/NavbarLayout";
import {
  GroupPage,
  ExerciseDetail,
  GroupDetailMemberDefault,
  // MemberDefault,
  ExerciseDetailApply,
  MyExerciseDetail,
  ViceLeaderDefault,
  EditGroupInfoDefault,
  InviteDefault,
} from "./pages/group";
import { ExerciseMapPage } from "./pages/home/ExerciseMapPage";
import { AlertPage } from "./pages/alarm/AlertPage";
import { HomePage } from "./pages/home/HomePage";
import {
  OnboardingAddressPage,
  OnboardingInfoPage,
  OnboardingLevelPage,
  OnboardingPage,
  OnboardingProfilePage,
} from "./pages/onboarding";
import {
  MyPage,
  MyPageEditLocationPage,
  MyPageEditPage,
  // MyPageExerciseDetailPage,
  MyPageMedalAddPage,
  MyPageMedalDetailPage,
  MyPageMyExercisePage,
  MyPageMyGroupPage,
  MyPageMyMedalPage,
  MyPageAddressSearchPage,
  MyPageProfile,
  MyPageProfileGroup,
  MyPageProfileMedal,
} from "./pages/mypage";

import { RecommendPage } from "./pages/home/Recommendpage";
import { GroupChatDetailPage } from "./pages/chat/GroupChatDetailPage";
import { PersonalChatDetailPage } from "./pages/chat/PersonalChatDetailPage";
import { MyGroupExercisePage } from "./pages/home/MyGroupExercisePage";
import { OnboardingConfirmStartPage } from "./pages/onboarding/OnBoardingConfirmStartPage";
import useSplashStore from "./store/useSplashStore";
import SplashScreen from "./components/login/SplashScreen";
import { useEffect } from "react";
// import { OnboardingProfileInputPage } from "./pages/onboarding/OnBoardingProfileInputPage";
import { ExerciseFilterPage } from "./pages/home/ExerciseFilterPage";
import { GroupLayout } from "./layout/GroupLayout";
import { GroupHomePage } from "./pages/group/GroupHomePage";
import { GroupChatPage } from "./pages/group/GroupChatPage";
import { GroupCalendarPage } from "./pages/group/GroupCalendarPage";
import { GroupRecommendPage } from "./pages/group/GroupRecommendPage";
import { GroupRecommendFilterPage } from "./pages/group/GroupRecommendFilterPage";
import { InviteGuest } from "./pages/group/InviteGuest";
import { GroupBasicInfo } from "./pages/group/groupMaking/GroupBasicInfo";
import { GroupActivity } from "./pages/group/groupMaking/GroupActivity";
import { GroupFilter } from "./pages/group/groupMaking/GroupFilter";
import { GroupSelect } from "./pages/group/groupMaking/GroupSelect";
import { ConfirmPage } from "./pages/onboarding/OnboardingConfirmPage";
import { GroupMember } from "./pages/group/groupMaking/GroupMember";
import { LocationSearchPage } from "./pages/location/LocationSearchPage";
import { LocationMapPage } from "./pages/location/LocationMapPage";
import { CreateExercise } from "./pages/group/CreateExercise";
import { EditLocationPage } from "./pages/home/EditLocationPage";
import { MyGroupDetailMemberDefault } from "./pages/group/MyGroupDetail/MemberDefault";
import OnboardingLayout from "./pages/onboarding/OnBoardingLayout";
import KakaoLogin from "./pages/login/kakaoLogin";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/login/kakao", element: <KakaoLogin /> },
  {
    path: "/onboarding",
    element: <OnboardingLayout />, //공통
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: "info", element: <OnboardingInfoPage /> },
      { path: "level", element: <OnboardingLevelPage /> },
      { path: "address", element: <OnboardingAddressPage /> },
      // { path: "address/search", element: <OnboardingAddressSearchPage /> },
      { path: "profile", element: <OnboardingProfilePage /> },
      // { path: "profile/input", element: <OnboardingProfileInputPage /> },
      { path: "confirm/start", element: <OnboardingConfirmStartPage /> },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <NavbarLayout />
      </PrivateRoute>
    ), // navbar + 로그인 필요 layout
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/group", element: <GroupPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/liked", element: <LikedPage /> },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <div className="pt-14">
          <Outlet />
        </div>
      </PrivateRoute>
    ), // 로그인 필요하지만 navbar 없는 layout
    children: [
      { path: "/edit/location", element: <EditLocationPage /> },
      { path: "/mypage/edit", element: <MyPageEditPage /> },
      { path: "/mypage/edit/location", element: <MyPageEditLocationPage /> },
      {
        path: "/mypage/edit/location/address",
        element: <MyPageAddressSearchPage />,
      },
      { path: "/mypage/mygroup", element: <MyPageMyGroupPage /> },
      { path: "/mypage/myexercise", element: <MyPageMyExercisePage /> },
      // {
      //   path: "/mypage/myexercise/:exerciseId",
      //   element: <MyPageExerciseDetailPage />,
      // },
      { path: "/mypage/mymedal", element: <MyPageMyMedalPage /> },
      { path: "/mypage/mymedal/:medalId", element: <MyPageMedalDetailPage /> },
      { path: "/mypage/mymedal/add", element: <MyPageMedalAddPage /> },

      { path: "/mypage/profile", element: <MyPageProfile /> },
      { path: "/mypage/profile/group", element: <MyPageProfileGroup /> },
      { path: "/mypage/profile/medal", element: <MyPageProfileMedal /> },

      { path: "/recommend", element: <RecommendPage /> },
      { path: "/mygroup-exercise", element: <MyGroupExercisePage /> },
      { path: "/recommend/filter", element: <ExerciseFilterPage /> },
      { path: "/exercise-map", element: <ExerciseMapPage /> },
      // { path: "/chat/:chatId", element: <ChatDetailPage /> },
      { path: "/chat/group/:chatId", element: <GroupChatDetailPage /> },
      { path: "/chat/personal/:chatId", element: <PersonalChatDetailPage /> },
      { path: "/alert", element: <AlertPage /> },
      { path: "/location/search", element: <LocationSearchPage /> },
      { path: "/location/map", element: <LocationMapPage /> },
      { path: "/group/recommend", element: <GroupRecommendPage /> },

      // 연두 모임
      { path: "/group/detail", element: <GroupDetailMemberDefault /> },
      // { path: "/group/MemberDefault", element: <MemberDefault /> },
      {
        path: "/group/Mygroup/MyExerciseDetail",
        element: <MyExerciseDetail />,
      },
      {
        path: "/group/Mygroup/ExerciseDetailApplye",
        element: <ExerciseDetailApply />,
      },
      { path: "/group/Mygroup/ExerciseDetail", element: <ExerciseDetail /> },

      { path: "/group/admin/vice-leader", element: <ViceLeaderDefault /> },
      { path: "/group/admin/edit-info", element: <EditGroupInfoDefault /> },
      { path: "/group/admin/invite", element: <InviteDefault /> },

      {
        path: "/group/recommend-filter",
        element: <GroupRecommendFilterPage />,
      },
      {
        path: "group/exercise/create",
        element: <CreateExercise />,
      },
      {
        path: "/group/:groupId",
        element: <GroupLayout />,
        children: [
          { index: true, element: <GroupHomePage /> },
          { path: "chat", element: <GroupChatPage /> },
          { path: "calendar", element: <GroupCalendarPage /> },
          { path: "member", element: <MyGroupDetailMemberDefault /> },
        ],
      },

      { path: "/group/detail/inviteGuest", element: <InviteGuest /> },
      { path: "/group/making/basic", element: <GroupBasicInfo /> },
      { path: "/group/making/activity", element: <GroupActivity /> },
      { path: "/group/making/filter", element: <GroupFilter /> },
      { path: "/group/making/select", element: <GroupSelect /> },
      { path: "/group/making/member", element: <GroupMember /> },
      { path: "/confirm", element: <ConfirmPage /> }, //onboarding과 making동시 사용
    ],
  },
]);

function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  useEffect(() => {
    // 스플래시 화면이 한 번도 표시되지 않은 경우에만 실행
    if (!hasShownSplash) {
      showSplash(); // 스플래시 화면 표시 및 상태 변경
    }
  }, [hasShownSplash, showSplash]);
  return (
    <div className="w-full flex justify-center items-center">
      <main
        className="w-full max-w-[444px] px-4 pb-8 bg-white"
        style={{ maxWidth: "444px", minHeight: "100dvh" }}
      >
        {isSplashShown ? <SplashScreen /> : <RouterProvider router={router} />}
      </main>
    </div>
  );
}

export default App;
