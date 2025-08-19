import { matchPath, Outlet, useLocation } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

export const NoNavbarLayout = () => {
  const location = useLocation();

  const noPaddingRoutes = [
    "/group/making/activity",
    "/group/making/basic",
    "/group/inviteGuest/:exerciseId",
    "/group/making/filter",
    "/group/making/select",
    "/group/making/member/:partyId",
    "/confirm",
    "/confirm/:partyId",
  ];
  const needsPadding = !noPaddingRoutes.some(
    pattern => !!matchPath({ path: pattern, end: true }, location.pathname),
  );

  return (
    <PrivateRoute>
      <div className={needsPadding ? "pt-14" : ""}>
        <Outlet />
      </div>
    </PrivateRoute>
  );
};
