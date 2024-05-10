import { useParams } from "react-router-dom";
import AuthForms from "../components/AuthForms/AuthForms.jsx";
import { useAuthFormsContext } from "../contexts/AuthFormsContext.jsx";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { setFormType } = useAuthFormsContext();
  const { typeParam } = useParams();

  useEffect(() => {
    if (typeParam && typeParam !== "forgotpassword") {
      setFormType(typeParam);
    }
  }, [typeParam]);

  return (
    <>
      {typeParam === "login" || typeParam === "register" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 4rem)",
          }}
        >
          <AuthForms />
        </div>
      ) : (
        <Navigate to={"/404-page"} />
      )}
    </>
  );
};

export default LoginPage;
