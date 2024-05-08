// Import modules
import {
  Button,
  Container,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import RateEventModal from "./RateEventModal";
import { useContext, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { AuthContext } from "../contexts/AuthContext";

const MemberEvents = ({ memberId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Handle rate event modal
  const [opened, { open, close }] = useDisclosure(false);
  const rateEventModal = { opened, open, close };

  // Fetch member`s joined events
  const fetchJoinedEvents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/?attendees=${memberId}`
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

  // Update event handler
  const updateEventHandler = async (eventId, payload) => {
    rateEventModal.close();
    console.log({ payload });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Berear ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        notifications.show({
          color: "indigo",
          title: "Your rating submitted successfully",
        });
        setEvents(
          events.map((currentEvent) => {
            if (currentEvent._id === eventId) {
              return responseData;
            }
            return currentEvent;
          })
        );
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while submitting rating: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() ||
          "Oops! Something went wrong. Please try after sometime.",
      });
    }
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

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
                          <Text>
                            <strong>Attendees:</strong>{" "}
                            {currentEvent.attendees.length}
                          </Text>
                        </Stack>
                      </Stack>
                    </Container>
                    {date < new Date() &&
                      currentEvent.ratingBy.indexOf(user.userId) < 0 && (
                        <Button
                          onClick={() => {
                            setSelectedEvent(currentEvent);
                            rateEventModal.open();
                          }}
                        >
                          Rate
                        </Button>
                      )}
                    {date < new Date() &&
                      currentEvent.ratingBy.indexOf(user.userId) >= 0 && (
                        <Text>Rated</Text>
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

      {/* Rate event modal */}
      <Modal
        padding="xl"
        radius="xl"
        size="lg"
        opened={rateEventModal.opened}
        onClose={rateEventModal.close}
        title="Rating"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <RateEventModal
          event={selectedEvent}
          updateEvent={updateEventHandler}
        />
      </Modal>
    </>
  );
};

export default MemberEvents;
