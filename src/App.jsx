// Import module
import { Route, Routes } from "react-router-dom";

// Import components
import Layout from "./components/Layout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AllEventsPage from "./pages/AllEventsPage";
import AllExpertsPage from "./pages/AllExpertsPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/events" element={<AllEventsPage />} />
        <Route path="/experts" element={<AllExpertsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
