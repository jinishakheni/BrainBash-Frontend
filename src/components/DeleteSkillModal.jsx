import { Button, Text } from "@mantine/core";

const DeleteSkillModal = ({ skillDetail, deleteSkillHandler }) => {
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
        radius="xl"
        fullWidth
        mt="xl"
        variant="filled"
        onClick={handleSubmit}
      >
        Delete
      </Button>
    </>
  );
};

export default DeleteSkillModal;
