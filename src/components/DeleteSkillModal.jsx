// Import modules
import { Button, Text } from "@mantine/core";

const DeleteSkillModal = ({ skillDetail, deleteSkillHandler }) => {
  // Handle submit event
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      skillName: skillDetail.skillName,
      opration: "delete",
    };
    deleteSkillHandler(payload);
  };

  return (
    <>
      <Text>{`Are you sure you want to delete ${skillDetail.skillName} skill?`}</Text>
      <Button
        variant="outline"
        radius="xl"
        color="light-dark(#2F4858, #CCD6D5)"
        fullWidth
        mt="xl"
        onClick={handleSubmit}
      >
        Delete
      </Button>
    </>
  );
};

export default DeleteSkillModal;
