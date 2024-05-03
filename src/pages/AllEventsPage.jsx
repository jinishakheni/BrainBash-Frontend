// Module imports
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Container,
  Group,
  Loader,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

// Style imports
import classes from "../styles/AllEventsPage.module.css";
import EventsGrid from "../components/EventsGrid";
import { FaFilter } from "react-icons/fa6";

const AllEventsPage = () => {
  const [events, setEvents] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced] = useDebouncedValue(searchTerm, 200);

  // Fetch all events from DB
  const fetchAllEvents = async () => {
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/events`;
    if (searchTerm) {
      apiEndPoint += `?title=${searchTerm}`;
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
        title: "Oops! Something went wrong. Please refresh the page and try again.",
      });
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [debounced]);

  return (
    <div className={classes.ctn}>
      <Container size="md" h={rem(50)} mb={rem(20)}>
        <Group justify="center">
          <TextInput
            styles={{
              input: {
                backgroundColor: "white", // TODO change color of search bar according to background
              },
            }}
            variant="filled"
            radius="xl"
            placeholder="Search..."
            leftSection={
              <FaSearch style={{ width: rem(16), height: rem(16) }} />
            }
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
          <UnstyledButton>
            <FaFilter />
          </UnstyledButton>
        </Group>
      </Container>
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
