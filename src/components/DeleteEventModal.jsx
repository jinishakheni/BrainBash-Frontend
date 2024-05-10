// Import module
import { Button, Text } from "@mantine/core";

const DeleteEventModal = ({ eventId, deleteEventHandler }) => {
  // Delete event handler
  const handleSubmit = (event) => {
    event.preventDefault();
    deleteEventHandler(eventId);
  };

  return (
    <>
      <Text>{`Are you sure you want to delete event?`}</Text>
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

export default DeleteEventModal;
