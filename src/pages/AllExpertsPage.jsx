// Module imports
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Loader, Title } from "@mantine/core";

// Style imports
import classes from "../styles/AllExpertsPage.module.css";

// Components import
import ExpertsGrid from "../components/ExpertsGrid";
import SearchAndFilter from "../components/SearchAndFilter";

const AllExpertsPage = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all events from DB
  const fetchMembers = async (searchTerm, category, skill) => {
    setIsLoading(true);
    let apiEndPoint = `${import.meta.env.VITE_API_URL}/api/users?`;
    if (searchTerm) {
      apiEndPoint += `fullName=${searchTerm}&`;
    }
    if (category) {
      apiEndPoint += `categories=${category}&`;
    }
    if (skill) {
      apiEndPoint += `skills=${skill}&`;
    }
    try {
      const response = await fetch(apiEndPoint);
      if (response.ok) {
        const responseData = await response.json();
        setMembers(responseData);
        setIsLoading(false);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error while fetching members: ", error);
      notifications.show({
        color: "red",
        title: "Oops! Something went wrong. Please try to re-login.",
      });
    }
  };

  return (
    <div className={classes.ctn}>
      <SearchAndFilter page="expert" fetchData={fetchMembers} />
      <div className={classes.gridCtn}>
        {!isLoading ? (
          members.length ? (
            <ExpertsGrid list={members}></ExpertsGrid>
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

export default AllExpertsPage;
