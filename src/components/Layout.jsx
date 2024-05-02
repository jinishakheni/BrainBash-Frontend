import { useLocation } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const ignoreRoute = ["/forgot-password"];
  const shouldDisplayNavbar = ignoreRoute.indexOf(location.pathname) < 0;

  return (
    <>
      {shouldDisplayNavbar && <Header />}
      {children}
      <Footer />
    </>
  );
};

export default Layout;
