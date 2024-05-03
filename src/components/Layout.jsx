import { useLocation } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const ignoreRoute = [
    "/forgot-password",
    "/account/login",
    "/account/register",
    "/reset-password",
  ];
  console.log(location.pathname);
  const shouldDisplayNavbar = !ignoreRoute.some((path) =>
    location.pathname.includes(path)
  );
  return (
    <>
      {shouldDisplayNavbar && <Header />}
      {children}
      <Footer />
    </>
  );
};

export default Layout;
