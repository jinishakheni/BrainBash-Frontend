// Module imports
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Loader, Title } from "@mantine/core";

// Style imports
import classes from "../styles/AllEventsPage.module.css";

// Components import
import EventsGrid from "../components/EventsGrid";
import SearchAndFilter from "../components/SearchAndFilter";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all events from DB
  const fetchEvents = async (searchTerm, category, skill, type) => {
    setIsLoading(true);
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/events?`;
    if (searchTerm) {
      apiEndPoint += `title=${searchTerm}&`;
    }
    if (category) {
      apiEndPoint += `category=${category}&`;
    }
    if (skill) {
      apiEndPoint += `skills=${skill}&`;
    }
    if (type) {
      apiEndPoint += `mode=${type}`;
    }
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

  return (
    <div className={classes.ctn}>
      <SearchAndFilter page="event" fetchData={fetchEvents} />
      <div className={classes.gridCtn}>
        {!isLoading ? (
          events.length ? (
            <EventsGrid list={events}></EventsGrid>
          ) : (
            <Title order={3}>No Data Found</Title>
          )
        ) : (
          <Loader color="blue" size="xl" type="bars" />
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;
