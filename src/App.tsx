import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/login/LoginPage";
import { ChatPage } from "./pages/chat/ChatPage";
import { LikedPage } from "./pages/like/LikedPage";
import { PrivateRoute } from "./layout/PrivateRoute";
import { NavbarLayout } from "./layout/NavbarLayout";
import {
  GroupPage,
  ExerciseDetail,
  // GroupDetailMemberDefault,
  MemberDefault,
  ExerciseDetailApply,
  MyExerciseDetail,
  // ViceLeaderDefault,
  EditGroupInfoDefault,
  // InviteDefault,
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
  MyPageMedalAddPage,
  MyPageMedalDetailPage,
  MyPageMyExercisePage,
  MyPageMyGroupPage,
  MyPageMyMedalPage,
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
import MemberRequestPage from "./pages/group/MemberRequest";
import KakaoLogin from "./pages/login/KakaoLogin";
import OnboardingLayout from "./pages/onboarding/onBoardingLayout";
import { useRawWsConnect } from "./hooks/useRawWsConnect";
import { resolveMemberId } from "./utils/auth";
import { NoNavbarLayout } from "./layout/NoPtLayout";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/login/kakao", element: <KakaoLogin /> },
  { path: "/location/search", element: <LocationSearchPage /> },
  { path: "/location/map", element: <LocationMapPage /> },
  //
  // {
  //   element: <NavbarLayout />, //인증체크x
  //   children: [{ path: "/", element: <HomePage /> }],
  // },
  {
    path: "/onboarding",
    element: <OnboardingLayout />, //공통
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: "info", element: <OnboardingInfoPage /> },
      { path: "level", element: <OnboardingLevelPage /> },
      { path: "address", element: <OnboardingAddressPage /> },
      { path: "profile", element: <OnboardingProfilePage /> },
      { path: "confirm/start", element: <OnboardingConfirmStartPage /> },
    ],
  },
  
  {
    element: (
      // <PrivateRoute>
        <NavbarLayout />
      //</PrivateRoute>
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
    element: <NoNavbarLayout />, // 로그인 필요하지만 navbar 없는 layout
    children: [
      { path: "/edit/location", element: <EditLocationPage /> },
      { path: "/mypage/edit", element: <MyPageEditPage /> },
      { path: "/mypage/edit/location", element: <MyPageEditLocationPage /> },

      { path: "/mypage/mygroup", element: <MyPageMyGroupPage /> },
      { path: "/mypage/myexercise", element: <MyPageMyExercisePage /> },
      { path: "/mypage/mymedal", element: <MyPageMyMedalPage /> },
      {
        path: "/mypage/profile/medal/:memberId/contest/:contestId",
        element: <MyPageMedalDetailPage />,
      },
      {
        path: "/mypage/mymedal/:contentId",
        element: <MyPageMedalDetailPage />,
      },

      { path: "/mypage/mymedal/add", element: <MyPageMedalAddPage /> },

      { path: "/mypage/profile/:memberId", element: <MyPageProfile /> },
      { path: "/mypage/profile/group", element: <MyPageProfileGroup /> },
      {
        path: "/mypage/profile/medal/:memberId",
        element: <MyPageProfileMedal />,
      },

      { path: "/recommend", element: <RecommendPage /> },
      { path: "/mygroup-exercise", element: <MyGroupExercisePage /> },
      { path: "/recommend/filter", element: <ExerciseFilterPage /> },
      { path: "/exercise-map", element: <ExerciseMapPage /> },
      // { path: "/chat/:chatId", element: <ChatDetailPage /> },
      { path: "/chat/group/:chatId", element: <GroupChatDetailPage /> },
      { path: "/chat/personal/:chatId", element: <PersonalChatDetailPage /> },
      { path: "/alert", element: <AlertPage /> },

      { path: "/group/recommend", element: <GroupRecommendPage /> },
      {
        path: "/group/:partyId/member-request",
        element: <MemberRequestPage />,
      },

      // 연두 모임
      //GroupDetailMemberDefault 사용X
      // { path: "/group/detail/:partyId", element: <GroupDetailMemberDefault /> },

      {
        path: "/group/Mygroup/MyExerciseDetail/:exerciseId",
        element: <MyExerciseDetail />,
      },
      {
        path: "/group/Mygroup/ExerciseDetailApplye",
        element: <ExerciseDetailApply />,
      },
      { path: "/group/Mygroup/ExerciseDetail", element: <ExerciseDetail /> },

      // { path: "/group/admin/vice-leader", element: <ViceLeaderDefault /> },
      {
        path: "/group/admin/edit-info/:partyId",
        element: <EditGroupInfoDefault />,
      },
      // { path: "/group/admin/invite", element: <InviteDefault /> },

      {
        path: "/group/recommend-filter",
        element: <GroupRecommendFilterPage />,
      },
      {
        path: "/group/exercise/:groupId/create",
        element: <CreateExercise />,
      },
      {
        path: "/group/exercise/edit/:exerciseId",
        element: <CreateExercise />,
      },
      {
        path: "/group/:groupId",
        element: <GroupLayout />,
        children: [
          { index: true, element: <GroupHomePage /> },
          { path: "chat", element: <GroupChatPage /> },
          { path: "calendar", element: <GroupCalendarPage /> },
          { path: "member", element: <MemberDefault /> },
        ],
      },

      { path: "/group/inviteGuest/:exerciseId", element: <InviteGuest /> },
      { path: "/group/making/basic", element: <GroupBasicInfo /> },
      { path: "/group/making/activity", element: <GroupActivity /> },
      { path: "/group/making/filter", element: <GroupFilter /> },
      { path: "/group/making/select", element: <GroupSelect /> },
      { path: "/group/making/member/:partyId", element: <GroupMember /> },
      { path: "/confirm", element: <ConfirmPage /> },
      { path: "/confirm/:partyId", element: <ConfirmPage /> },
    ],
  },
]);

function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();

  //🌟
  // 전역으로 한 번만 웹소켓 연결
  // const memberId = Number(localStorage.getItem("memberId") || 1);
  // useRawWsConnect({ memberId, origin: "https://cockple.store" });
  // 전역 WS 연결 (토큰/멤버아이디가 있을 때만)
  // 항상 호출. memberId가 없으면 0(무효값)을 넘김
  const memberId = resolveMemberId() ?? 0;
  useRawWsConnect({ memberId, origin: "https://cockple.store" });
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
