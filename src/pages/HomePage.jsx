// Module imports
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Title, Button, Flex, Image, em } from "@mantine/core";
import classes from "../styles/HomePage.module.css";
import homepic from "../assets/images/homepic.png";
import { useAuthFormsContext } from "../contexts/AuthFormsContext";
import { useMediaQuery } from "@mantine/hooks";

// Components import
import EventsGrid from "../components/EventsGrid";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery(`(max-width: ${em(500)})`);

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
        console.log(responseData);

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
      <Flex className={classes.header}>
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
            size={isMobile ? "xs" : "sm"}
            onClick={() => {
              toggleAuthForms("login", "true");
            }}
          >
            Join BrainBash
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
              <div className={classes.listEvents}>
                <EventsGrid list={events.slice(0, 4)}></EventsGrid>
                <Button onClick={() => navigate("/events")}>
                  See All Events!
                </Button>
              </div>
            ) : (
              <Title order={3}>No Data Found</Title>
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
