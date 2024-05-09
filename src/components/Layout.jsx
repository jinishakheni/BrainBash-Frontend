import { useLocation } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";
import AuthForms from "./AuthForms/AuthForms";

const Layout = ({ children }) => {
  const location = useLocation();
  const ignoreRoute = [
    "/forgot-password",
    "/account/login",
    "/account/register",
    "/reset-password",
  ];
  const shouldDisplayNavbar = !ignoreRoute.some((path) =>
    location.pathname.includes(path)
  );
  return (
    <>
      {shouldDisplayNavbar && (
        <>
          <Header />
          <AuthForms></AuthForms>
        </>
      )}
      {children}
      {shouldDisplayNavbar && <Footer />}
    </>
  );
};

export default Layout;
