import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { LoginPage } from "./pages/login/LoginPage";
import { ChatPage } from "./pages/chat/ChatPage";
import { LikedPage } from "./pages/like/LikedPage";
import { PrivateRoute } from "./layout/PrivateRoute";
import { NavbarLayout } from "./layout/NavbarLayout";
import {
  GroupPage,
  ExerciseDetail,
  MemberDefault,
  ExerciseDetailApply,
  MyExerciseDetail,
  ViceLeaderDefault,
  EditGroupInfoDefault,
} from "./pages/group";
import { AlertPage } from "./pages/alarm/AlertPage";
import { HomePage } from "./pages/home/HomePage";
import useSplashStore from "./store/useSplashStore";
import SplashScreen from "./components/login/SplashScreen";
import { GroupLayout } from "./layout/GroupLayout";
import { GroupHomePage } from "./pages/group/GroupHomePage";
import { GroupChatPage } from "./pages/group/GroupChatPage";
import { GroupCalendarPage } from "./pages/group/GroupCalendarPage";
import { GroupBasicInfo } from "./pages/group/groupMaking/GroupBasicInfo";
import { GroupActivity } from "./pages/group/groupMaking/GroupActivity";
import { GroupFilter } from "./pages/group/groupMaking/GroupFilter";
import { GroupSelect } from "./pages/group/groupMaking/GroupSelect";
import { GroupMember } from "./pages/group/groupMaking/GroupMember";
import { CreateExercise } from "./pages/group/CreateExercise";
import KakaoLogin from "./pages/login/KakaoLogin";
import OnboardingLayout from "./pages/onboarding/onBoardingLayout";
import { useRawWsConnect } from "./hooks/useRawWsConnect";
import { resolveMemberId } from "./utils/auth";
import { NoNavbarLayout } from "./layout/NoPtLayout";

// 지도/위치 - lazy (카카오맵 SDK 포함)
const ExerciseMapPage = lazy(() =>
  import("./pages/home/ExerciseMapPage").then(m => ({ default: m.ExerciseMapPage })),
);
const LocationSearchPage = lazy(() =>
  import("./pages/location/LocationSearchPage").then(m => ({ default: m.LocationSearchPage })),
);
const LocationMapPage = lazy(() =>
  import("./pages/location/LocationMapPage").then(m => ({ default: m.LocationMapPage })),
);
const EditLocationPage = lazy(() =>
  import("./pages/home/EditLocationPage").then(m => ({ default: m.EditLocationPage })),
);

// 채팅 상세 - lazy (무거운 WebSocket 로직)
const GroupChatDetailPage = lazy(() =>
  import("./pages/chat/GroupChatDetailPage").then(m => ({ default: m.GroupChatDetailPage })),
);
const PersonalChatDetailPage = lazy(() =>
  import("./pages/chat/PersonalChatDetailPage").then(m => ({ default: m.PersonalChatDetailPage })),
);

// 기타 - lazy
const RecommendPage = lazy(() =>
  import("./pages/home/Recommendpage").then(m => ({ default: m.RecommendPage })),
);
const MyGroupExercisePage = lazy(() =>
  import("./pages/home/MyGroupExercisePage").then(m => ({ default: m.MyGroupExercisePage })),
);
const ExerciseFilterPage = lazy(() =>
  import("./pages/home/ExerciseFilterPage").then(m => ({ default: m.ExerciseFilterPage })),
);
const GroupRecommendPage = lazy(() =>
  import("./pages/group/GroupRecommendPage").then(m => ({ default: m.GroupRecommendPage })),
);
const GroupRecommendFilterPage = lazy(() =>
  import("./pages/group/GroupRecommendFilterPage").then(m => ({ default: m.GroupRecommendFilterPage })),
);
const InviteGuest = lazy(() =>
  import("./pages/group/InviteGuest").then(m => ({ default: m.InviteGuest })),
);
const MemberRequestPage = lazy(() =>
  import("./pages/group/MemberRequest"),
);

// 온보딩 - lazy
const OnboardingPage = lazy(() =>
  import("./pages/onboarding/OnboardingPage").then(m => ({ default: m.OnboardingPage })),
);
const OnboardingInfoPage = lazy(() =>
  import("./pages/onboarding/OnboardingInfoPage").then(m => ({ default: m.OnboardingInfoPage })),
);
const OnboardingLevelPage = lazy(() =>
  import("./pages/onboarding/OnboardingLevelPage").then(m => ({ default: m.OnboardingLevelPage })),
);
const OnboardingAddressPage = lazy(() =>
  import("./pages/onboarding/OnboardingAddressPage").then(m => ({ default: m.OnboardingAddressPage })),
);
const OnboardingProfilePage = lazy(() =>
  import("./pages/onboarding/OnboardingProfilePage").then(m => ({ default: m.OnboardingProfilePage })),
);
const OnboardingConfirmStartPage = lazy(() =>
  import("./pages/onboarding/OnBoardingConfirmStartPage").then(m => ({ default: m.OnboardingConfirmStartPage })),
);
const ConfirmPage = lazy(() =>
  import("./pages/onboarding/OnboardingConfirmPage").then(m => ({ default: m.ConfirmPage })),
);

// 마이페이지 - lazy
const MyPage = lazy(() =>
  import("./pages/mypage/MyPage").then(m => ({ default: m.MyPage })),
);
const MyPageEditPage = lazy(() =>
  import("./pages/mypage/MyPageEditPage").then(m => ({ default: m.MyPageEditPage })),
);
const MyPageEditLocationPage = lazy(() =>
  import("./pages/mypage/MyPageEditLocationPage").then(m => ({ default: m.MyPageEditLocationPage })),
);
const MyPageMyGroupPage = lazy(() =>
  import("./pages/mypage/MyPageMyGroupPage").then(m => ({ default: m.MyPageMyGroupPage })),
);
const MyPageMyExercisePage = lazy(() =>
  import("./pages/mypage/MyPageMyExercisePage").then(m => ({ default: m.MyPageMyExercisePage })),
);
const MyPageMyMedalPage = lazy(() =>
  import("./pages/mypage/MyPageMyMedalPage").then(m => ({ default: m.default })),
);
const MyPageMedalDetailPage = lazy(() =>
  import("./pages/mypage/MyPageMedalDetailPage").then(m => ({ default: m.MyPageMedalDetailPage })),
);
const MyPageMedalAddPage = lazy(() =>
  import("./pages/mypage/MyPageMedalAddpage").then(m => ({ default: m.MyPageMedalAddPage })),
);
const MyPageProfile = lazy(() =>
  import("./pages/mypage/MyPageProfile").then(m => ({ default: m.MyPageProfile })),
);
const MyPageProfileGroup = lazy(() =>
  import("./pages/mypage/MyPageProfileGroup").then(m => ({ default: m.MyPageProfileGroup })),
);
const MyPageProfileMedal = lazy(() =>
  import("./pages/mypage/MyPageProfileMedal").then(m => ({ default: m.MyPageProfileMedal })),
);

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
      { path: "/group/admin/vice-leader/:groupId", element: <ViceLeaderDefault /> },

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

      {
        path: "/group/inviteGuest/:exerciseId",
        element: <InviteGuest />,
      },
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

  const memberId = resolveMemberId() ?? 0;
  useRawWsConnect({ memberId, origin: import.meta.env.VITE_WS_ORIGIN });
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
        {isSplashShown ? (
          <SplashScreen />
        ) : (
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;
