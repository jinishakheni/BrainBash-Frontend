import { useState } from "react";
import ForgotPasswordForm from "../../components/AuthForms/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  return (
    <ForgotPasswordForm email={email} setEmail={setEmail}></ForgotPasswordForm>
  );
};

export default ForgotPasswordPage;
