import { ScrollToTop } from "../components/common/ScrollToTop";

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // const navigate = useNavigate();
  // const isAuthenticated = localStorage.getItem("accessToken");
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};
