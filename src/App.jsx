// Import module
import { Route, Routes } from "react-router-dom";

// Import components
import Layout from "./components/Layout";
import ForgotPasswordPage from "./pages/PasswordPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/PasswordPages/ResetPasswordPage";
import AllEventsPage from "./pages/AllEventsPage";
import AllExpertsPage from "./pages/AllExpertsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { AuthFormsProvider } from "./contexts/AuthFormsContext";
import IsAnon from "./components/IsAnon";
import EventDetailPage from "./pages/EventDetailPage";
import ChatPage from "./pages/ChatPage";
import IsPrivate from "./components/IsPrivate";
import MemberPage from "./pages/MemberPage";

function App() {
  return (
    <AuthFormsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/account/:typeParam"
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/experts" element={<AllExpertsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/direct/inbox" element={<IsPrivate><ChatPage /></IsPrivate>} />
          <Route path="/direct/t/:chatId" element={<IsPrivate><ChatPage /></IsPrivate>} />

          <Route path="/members/:memberId" element={<MemberPage />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </Layout>
    </AuthFormsProvider>
  );
}

export default App;
