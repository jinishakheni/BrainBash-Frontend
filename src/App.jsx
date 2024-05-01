import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import ResetPassword from "./pages/passwordPages/ResetPassword";
import ForgotPasswordPage from "./pages/passwordPages/ForgotPasswordPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/account/:typeParam" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
