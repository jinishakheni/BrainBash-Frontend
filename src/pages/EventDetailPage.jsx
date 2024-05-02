import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  Image,
  Container,
  Space,
  Button,
  Group,
  Loader,
  TextInput,
  UnstyledButton,
  rem,
  Title,
  Text,
  Flex,
} from "@mantine/core";
import no_user_icon from "../assets/images/no_user_icon.png";

// Style imports
import classes from "../styles/EventDetailPage.module.css";

const EventDetailPage = () => {
  // Get event id from url
  const { id } = useParams();
  // Hook to keep event information
  const [event, setEvent] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("no date available");

  // Fetch the event from from DB
  const fetchEvent = async () => {
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/events/${id}`;
    try {
      const response = await fetch(apiEndPoint);
      if (response.ok) {
        const responseData = await response.json();
        setEvent(responseData);
        console.log(responseData);
        const eventDate = new Date(event.startingTime);
        setDate(eventDate);
        console.log(date);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      console.error("Error while fetching event: ", error);
      notifications.show({
        color: "red",
        title: "Oops! Something went wrong. Please try to re-login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  if (isLoading)
    return <Container className={classes.loader}>Loading...</Container>;
  if (!event)
    return (
      <Container className={classes.error}>
        No event data found or there was an error.
      </Container>
    );

  return (
    <Container fluid className={classes.mainContainer}>
      <Flex className={classes.header}>
        <Flex className={classes.textHeader}>
          <Title className={classes.title}>{event.title}</Title>
          <Flex className={classes.hostSection}>
            <Image
              radius="md"
              w="50px"
              src={no_user_icon}
              alt="Host icon"
              className={classes.userPicture}
            />
            <div className={classes.hostInfo}>
              <Text size="sm">Hosted by:</Text>
              <Link to={`/user/${event.hostId._id}`} className={classes.link}>
                <Text size="md" fw={700}>
                  {event.hostId.firstName} {event.hostId.lastName}
                </Text>
              </Link>
            </div>
          </Flex>
        </Flex>
        <Button>Join</Button>
      </Flex>
      <Flex className={classes.eventInformation}>
        <Image
          w="50%"
          radius="md"
          src={event.imageUrl}
          alt="Event photo"
          className={classes.eventImage}
        />
        <Flex direction="column" className={classes.eventDetails}>
          <Text size="lg">{event.description}</Text>
          <Space h="md" />
          <Text size="sm">
            Starting time:{" "}
            <strong>
              {date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </Text>
          <Space h="md" />
          <Text size="sm">
            Duration: <strong>{event.duration}</strong>
          </Text>
        </Flex>
      </Flex>
      <Flex className="attendeesInformation">
        <Text>Attendees</Text>
        <ul className={classes.attendeesList}>
          {event.attendees.map((attendee, idx) => (
            <li key={idx}>{`${idx}. ${attendee}`}</li>
          ))}
        </ul>
      </Flex>
    </Container>
  );
};

export default EventDetailPage;
