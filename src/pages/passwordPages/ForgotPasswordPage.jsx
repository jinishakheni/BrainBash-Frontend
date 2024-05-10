import { useState } from "react";
import ForgotPasswordForm from "../../components/AuthForms/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection:"column",
        alignItems: "center",
        height: "calc(100vh - 4rem)",
      }}
    >
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
      ></ForgotPasswordForm>
    </div>
  );
};

export default ForgotPasswordPage;
