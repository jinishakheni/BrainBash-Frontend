import { Modal } from "@mantine/core";
import { useAuthFormsContext } from "../../contexts/AuthFormsContext";

const ConditionalModal = ({ children }) => {
  const { showModal, toggleAuthForms } = useAuthFormsContext();
  console.log(showModal);

  return (
    <>
      {showModal ? (
        <Modal opened={showModal} onClose={toggleAuthForms}>
          <Modal.Body>{children}</Modal.Body>
        </Modal>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ConditionalModal;
