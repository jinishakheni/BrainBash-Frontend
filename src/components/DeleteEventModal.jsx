import { Button, Text } from "@mantine/core";

const DeleteEventModal = ({ eventId, deleteEventHandler }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    deleteEventHandler(eventId);
  };

  return (
    <>
      <Text>{`Are you sure you want to delete event?`}</Text>
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

export default DeleteEventModal;
