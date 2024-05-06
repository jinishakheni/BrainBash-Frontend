import { useState } from "react";
import LoginRegisterForm from "./LoginRegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAuthFormsContext } from "../../contexts/AuthFormsContext";

const AuthForms = () => {
  const [email, setEmail] = useState("");

  const { formType } = useAuthFormsContext();

  return (
    <>
      {(formType === "login" || formType === "register") && (
        <LoginRegisterForm
          email={email}
          setEmail={setEmail}
        ></LoginRegisterForm>
      )}
      {formType === "forgotpassword" && (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
        ></ForgotPasswordForm>
      )}
    </>
  );
};

export default AuthForms;
