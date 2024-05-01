import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
<<<<<<< HEAD
import { LoginPage } from "./pages/LoginPage";
=======
import ResetPassword from "./pages/passwordPages/ResetPassword";
import ForgotPasswordPage from "./pages/passwordPages/ForgotPasswordPage";
>>>>>>> main

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
      <Route path="/account/:typeParam" element={<LoginPage />} />
=======
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
>>>>>>> main
    </Routes>
  );
}

export default App;
