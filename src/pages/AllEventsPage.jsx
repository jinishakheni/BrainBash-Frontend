// Module imports
import { notifications } from "@mantine/notifications";
import { useContext, useEffect, useState } from "react";
import { Loader } from "@mantine/core";

// Style imports
import classes from "../styles/AllEventsPage.module.css";
import EventsGrid from "../components/EventsGrid";
import SearchAndFilter from "../components/SearchAndFilter";
import { CategoryContext } from "../contexts/CategoryContext";

const AllEventsPage = () => {
  const [events, setEvents] = useState();
  const { fetchCategories } = useContext(CategoryContext);

  // Fetch all events from DB
  const fetchEvents = async (searchTerm, category, skill, type) => {
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/events?`;
    if (searchTerm) {
      apiEndPoint += `title=${searchTerm}&`;
    }
    if (category) {
      apiEndPoint += `categories=${category}&`;
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
      } else {
        throw new Error(response);
      }
    } catch (error) {
      console.error("Error while fetching events: ", error);
      notifications.show({
        color: "red",
        title:
          "Oops! Something went wrong. Please refresh the page and try again.",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={classes.ctn}>
      <SearchAndFilter fetchEvents={fetchEvents} />
      <div className={classes.gridCtn}>
        {events ? (
          <EventsGrid list={events}></EventsGrid>
        ) : (
          <Loader color="blue" size="xl" type="bars" />
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;
