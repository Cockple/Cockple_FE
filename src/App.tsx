import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { SplashPage } from "./pages/login/SplashPage";
import { LoginPage } from "./pages/login/LoginPage";
import { ChatPage } from "./pages/chat/ChatPage";
import { LikedPage } from "./pages/like/LikedPage";
import { ChatDetailPage } from "./pages/chat/ChatDetailPage";
import { PrivateRoute } from "./layout/PrivateRoute";
import { NavbarLayout } from "./layout/NavbarLayout";
import { GroupPage } from "./pages/group";
import { RecommendPage } from "./pages/home/RecommendPage";
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
} from "./pages/mypage";

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
    element: <OnboardingPage />,
    children: [
      { path: "info", element: <OnboardingInfoPage /> },
      { path: "level", element: <OnboardingLevelPage /> },
      { path: "address", element: <OnboardingAddressPage /> },
      { path: "profile", element: <OnboardingProfilePage /> },
      { path: "confirm", element: <OnboardingConfirmPage /> },
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
      { path: "/exercise-map", element: <ExerciseMapPage /> },
      { path: "/chat/:chatId", element: <ChatDetailPage /> },
      { path: "/alarm", element: <AlarmPage /> },
    ],
  },
]);

function App() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-full h-full max-w-[444px] bg-white">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
