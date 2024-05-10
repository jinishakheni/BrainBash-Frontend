import { useParams } from "react-router-dom";
import AuthForms from "../components/AuthForms/AuthForms.jsx";
import { useAuthFormsContext } from "../contexts/AuthFormsContext.jsx";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { setFormType } = useAuthFormsContext();
  const { typeParam } = useParams();

  useEffect(() => {
    if (typeParam && typeParam!=="forgotpassword") {
      setFormType(typeParam);
    }
  }, [typeParam]);

  //return <AuthForms></AuthForms>;
  return (
    <>
      {typeParam === "login" || typeParam === "register" ? (
        <AuthForms />
      ) : (
        <Navigate to={"/404-page"} />
      )}
    </>
  );
};

export default LoginPage;
