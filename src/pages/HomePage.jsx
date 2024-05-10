// Module imports
import { notifications } from "@mantine/notifications";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader,
  Title,
  Button,
  Flex,
  Image,
  em,
  Text,
  Group,
} from "@mantine/core";
import classes from "../styles/HomePage.module.css";
import homepic from "../assets/images/homepic-removebg.png";
import { useAuthFormsContext } from "../contexts/AuthFormsContext";
import { useMediaQuery } from "@mantine/hooks";
import { AuthContext } from "../contexts/AuthContext.jsx";

// Components import
import EventsGrid from "../components/EventsGrid";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery(`(max-width: ${em(500)})`);

  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn } = useContext(AuthContext);

  const { toggleAuthForms } = useAuthFormsContext();
  const navigate = useNavigate();

  // Fetch all events from DB
  const fetchEvents = async () => {
    setIsLoading(true);
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/events`;
    try {
      const response = await fetch(apiEndPoint);
      if (response.ok) {
        const responseData = await response.json();

        setEvents(responseData);
        setIsLoading(false);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error while fetching events: ", error);
      notifications.show({
        color: "red",
        title:
          "Oops! Something went wrong. Please refresh the page and try again.",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Flex className={classes.root}>
      <Flex
        className={classes.header}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Flex className={classes.headerText}>
          <Title order={1}>
            Unleash Your Curiosity and Dive into a World of Expert-Led Insights
            at BrainBash
          </Title>
          <Title order={2}>
            Connect with leading experts and immerse yourself in a world of
            knowledge through interactive events and personalized consultations.
            Discover a community where your thirst for learning meets endless
            opportunities for growth.
          </Title>
          <Button
            variant="outline"
            radius="xl"
            color="light-dark(#2F4858, #CCD6D5)"
            size={isMobile ? "xs" : "sm"}
            onClick={() => {
              !isLoggedIn
                ? toggleAuthForms("login", "true")
                : navigate("/experts");
            }}
          >
            {!isLoggedIn ? "Join BrainBash" : "See all experts"}
          </Button>
        </Flex>
        <div className={classes.headerImage}>
          <Image src={homepic} />
        </div>
      </Flex>

      <div className={classes.upcomingEvents}>
        <Title order={3}>Upcoming events:</Title>
        <>
          {!isLoading ? (
            events.length ? (
              <>
                <Group mb={10}>
                  <EventsGrid list={events.slice(0, 4)}></EventsGrid>
                  <Button
                    variant="outline"
                    radius="xl"
                    color="light-dark(#2F4858, #CCD6D5)"
                    onClick={() => navigate("/events")}
                  >
                    See All Events!
                  </Button>
                </Group>
              </>
            ) : (
              <>
                <Text size="sm">There are no events at this moment...</Text>
              </>
            )
          ) : (
            <Loader color="blue" size="xl" type="bars" />
          )}
        </>
      </div>
    </Flex>
  );
};

export default HomePage;
