import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { SplashPage } from "./pages/login/SplashPage";
import { LoginPage } from "./pages/login/LoginPage";
import { ChatPage } from "./pages/chat/ChatPage";
import { LikedPage } from "./pages/like/LikedPage";
import { PrivateRoute } from "./layout/PrivateRoute";
import { NavbarLayout } from "./layout/NavbarLayout";
import { GroupPage } from "./pages/group";
import { ExerciseMapPage } from "./pages/home/ExerciseMapPage";
import { AlarmPage } from "./pages/alarm/AlarmPage";
import { HomePage } from "./pages/home/HomePage";
import {
  OnboardingAddressPage,
  OnboardingConfirmPage,
  OnboardingInfoPage,
  OnboardingLevelPage,
  OnboardingPage,
  OnboardingProfilePage,
} from "./pages/onboarding";
import {
  MyPage,
  MyPageEditLocationPage,
  MyPageEditPage,
  MyPageExerciseDetailPage,
  MyPageMedalAddPage,
  MyPageMedalDetailPage,
  MyPageMyExercisePage,
  MyPageMyGroupPage,
  MyPageMyMedalPage,
  MyPageAddressSearchPage,
} from "./pages/mypage";
import { RecommendPage } from "./pages/home/RecommendPage";
import { GroupChatDetailPage } from "./pages/chat/GroupChatDetailPage";
import { PersonalChatDetailPage } from "./pages/chat/PersonalChatDetailPage";
import { MyGroupExercisePage } from "./pages/home/MyGroupExercisePage";
import OnboardingLayout from "./pages/onboarding/OnBoardingLayout";
import { OnboardingAddressSearchPage } from "./pages/onboarding/OnboardingAddressSearchPage";
import { OnboardingConfirmStartPage } from "./pages/onboarding/OnBoardingConfirmStartPage";
// import { OnboardingProfileInputPage } from "./pages/onboarding/OnBoardingProfileInputPage";

const router = createBrowserRouter([
  {
    path: "/splash",
    element: <SplashPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingLayout />, //공통
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: "info", element: <OnboardingInfoPage /> },
      { path: "level", element: <OnboardingLevelPage /> },
      { path: "address", element: <OnboardingAddressPage /> },
      { path: "address/search", element: <OnboardingAddressSearchPage /> },
      { path: "profile", element: <OnboardingProfilePage /> },
      // { path: "profile/input", element: <OnboardingProfileInputPage /> },
      { path: "confirm", element: <OnboardingConfirmPage /> },
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
        <Outlet />
      </PrivateRoute>
    ), // 로그인 필요하지만 navbar 없는 layout
    children: [
      { path: "/mypage/edit", element: <MyPageEditPage /> },
      { path: "/mypage/edit/location", element: <MyPageEditLocationPage /> },
      {
        path: "/mypage/edit/location/address",
        element: <MyPageAddressSearchPage />,
      },
      { path: "/mypage/mygroup", element: <MyPageMyGroupPage /> },
      { path: "/mypage/myexercise", element: <MyPageMyExercisePage /> },
      {
        path: "/mypage/myexercise/:exerciseId",
        element: <MyPageExerciseDetailPage />,
      },
      { path: "/mypage/mymedal", element: <MyPageMyMedalPage /> },
      { path: "/mypage/mymedal/:medalId", element: <MyPageMedalDetailPage /> },
      { path: "/mypage/mymedal/add", element: <MyPageMedalAddPage /> },
      { path: "/recommend", element: <RecommendPage /> },
      { path: "/mygroup-exercise", element: <MyGroupExercisePage /> },
      { path: "/exercise-map", element: <ExerciseMapPage /> },
      // { path: "/chat/:chatId", element: <ChatDetailPage /> },
      { path: "/chat/group/:chatId", element: <GroupChatDetailPage /> },
      { path: "/chat/personal/:chatId", element: <PersonalChatDetailPage /> },
      { path: "/alarm", element: <AlarmPage /> },
    ],
  },
]);

function App() {
  return (
    <div className="h-auto w-full flex justify-center items-center">
      <main
        className="w-full min-h-screen max-w-[444px] px-4 bg-white"
        style={{ maxWidth: "444px" }}
      >
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
