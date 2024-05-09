// Import modules
import {
  Container,
  Group,
  Image,
  Modal,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Import components
import DeleteEventModal from "./DeleteEventModal";

// Import context
import { AuthContext } from "../contexts/AuthContext";

const MemberEvents = ({ memberId, refreshHostedEvents }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const navigate = useNavigate();
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  // Handle delete skill modal
  const [opened, { open, close }] = useDisclosure(false);
  const deleteEventModal = { opened, open, close };

  // Fetch member`s hosted events
  const fetchHostedEvents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/?hostId=${memberId}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setEvents(responseData);
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while fetching event details: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() || "Oops! Something went wrong. Please try again.",
      });
    }
  };

  // Delete event handler
  const deleteEventHandler = async (eventId) => {
    deleteEventModal.close();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Berear ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        notifications.show({
          color: "indigo",
          title: "Deleted successfully",
        });
        fetchHostedEvents();
      } else if (response.status === 401) {
        logOutUser();
        navigate("/account/login");
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while deleting event: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() ||
          "Oops! Something went wrong. Please try after sometime.",
      });
    }
  };

  useEffect(() => {
    fetchHostedEvents();
  }, [refreshHostedEvents]);

  return (
    <>
      <Container mt={20} pl={0} pr={0} mih={rem(400)}>
        <Stack gap={10}>
          {events.length ? (
            events.map((currentEvent) => {
              const date = new Date(currentEvent.startingTime);
              return (
                <Paper
                  h={rem(150)}
                  shadow="xs"
                  w="100%"
                  p={10}
                  key={currentEvent._id}
                >
                  <Group align="center" h="100%">
                    <Container ml={0} mr={0}>
                      <Image
                        src={currentEvent.imageUrl}
                        h={rem(100)}
                        w={rem(200)}
                        fit="contain"
                        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                        onClick={() => navigate(`/events/${currentEvent._id}`)}
                      />
                    </Container>
                    <Container ml={0}>
                      <Stack>
                        <Title order={5}>{currentEvent.title}</Title>
                        <Stack gap={4}>
                          <Text>
                            <strong>Skills:</strong>{" "}
                            {currentEvent.skills.length
                              ? currentEvent.skills.join(", ")
                              : "-"}
                          </Text>
                          <Group>
                            <Text>
                              <strong>Date:</strong>{" "}
                              {`${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}-${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}-${date.getFullYear()}`}
                            </Text>
                            <Text>
                              <strong>Time:</strong>{" "}
                              {`${date
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`}
                            </Text>
                            <Text>
                              <strong>Duration:</strong> {currentEvent.duration}
                            </Text>
                          </Group>
                          <Group>
                            <Text>
                              <strong>Attendees:</strong>{" "}
                              {currentEvent.attendees.length}
                            </Text>
                            {date < new Date() ? (
                              <Group gap={3}>
                                <Text>
                                  <strong>Rating:</strong>{" "}
                                </Text>
                                <Rating
                                  fractions={2}
                                  name="Rating"
                                  value={currentEvent.rating}
                                  readOnly
                                />{" "}
                                |{" "}
                                <Text>
                                  {currentEvent.ratingBy.length} Ratings
                                </Text>
                              </Group>
                            ) : (
                              <Text c="teal.4">Upcoming event...</Text>
                            )}
                          </Group>
                        </Stack>
                      </Stack>
                    </Container>
                    {user?.userId === memberId && isLoggedIn && (
                      <UnstyledButton
                        onClick={() => {
                          setSelectedEvent(currentEvent._id);
                          deleteEventModal.open();
                        }}
                        style={{ position: "relative", top: "-40%" }}
                      >
                        <MdDelete size={20} />
                      </UnstyledButton>
                    )}
                  </Group>
                </Paper>
              );
            })
          ) : (
            <Group justify="center">
              <Text>No data found</Text>
            </Group>
          )}
        </Stack>
      </Container>

      {/* Delete skill modal */}
      <Modal
        padding="xl"
        radius="xl"
        size="lg"
        opened={deleteEventModal.opened}
        onClose={deleteEventModal.close}
        title="Confirm Deletion"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <DeleteEventModal
          eventId={selectedEvent}
          deleteEventHandler={deleteEventHandler}
        />
      </Modal>
    </>
  );
};

export default MemberEvents;
