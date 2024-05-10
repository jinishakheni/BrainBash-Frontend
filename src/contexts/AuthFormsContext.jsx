import { createContext, useState, useContext } from "react";

const AuthFormsContext = createContext();

export const useAuthFormsContext = () => useContext(AuthFormsContext);

export const AuthFormsProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("");

  const toggleAuthForms = (formType, showAuthForm) => {
    setFormType(formType);
    setShowModal(showAuthForm);
  };

  return (
    <AuthFormsContext.Provider
      value={{ showModal, toggleAuthForms, formType, setFormType }}
    >
      {children}
    </AuthFormsContext.Provider>
  );
};
