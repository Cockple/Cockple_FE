interface PrivateRouteProps {
  children?: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // 로그인 여부를 확인하는 로직 추가

  return <>{children}</>;
};
