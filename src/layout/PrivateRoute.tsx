import { ScrollToTop } from "../components/common/ScrollToTop";

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};
