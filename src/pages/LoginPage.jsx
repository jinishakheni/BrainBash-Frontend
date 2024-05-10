import { useParams } from "react-router-dom";
import AuthForms from "../components/AuthForms/AuthForms.jsx";
import { useAuthFormsContext } from "../contexts/AuthFormsContext.jsx";
import { useEffect } from "react";

const LoginPage = () => {
  const { setFormType } = useAuthFormsContext();
  const { typeParam } = useParams();

  useEffect(() => {
    if (typeParam) {
      setFormType(typeParam);
    }
  }, [typeParam]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 4rem)",
      }}
    >
      <AuthForms></AuthForms>
    </div>
  );
};

export default LoginPage;
