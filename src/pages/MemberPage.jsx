// Module imports
import {
  Avatar,
  Button,
  Container,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

// Components import
import MemberPersonalInfo from "../components/MemberPersonalInfo";
import MemberEvents from "../components/MemberEvents";
import MemberJoinedEvents from "../components/MemberJoinedEvents";
import EditMemberModal from "../components/EditMemberModal";
import CreateEventModal from "../components/CreateEventModal";

// Context import
import { AuthContext } from "../contexts/AuthContext";
import { useAuthFormsContext } from "../contexts/AuthFormsContext";

// CSS import
import classes from "../styles/MemberPage.module.css";

//Image imports
const no_gender_photo = "../assets/images/no_photo.png";

// Helper import
import { createConversation } from "../helper/utils";

const MemberPage = () => {
  const { memberId } = useParams();
  const [memberDetails, setMemberDetails] = useState({});
  const [activeTab, setActiveTab] = useState("PersonalInfo");
  const [refreshHostedEvents, setRefreshHostedEvents] = useState(false);
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // Handle member's personal info update modal
  let [opened, { open, close }] = useDisclosure(false);
  const editPersonalInfoModal = { opened, open, close };

  // Handle event modal
  [opened, { open, close }] = useDisclosure(false);
  const createEventModal = { opened, open, close };

  const { toggleAuthForms } = useAuthFormsContext();

  // Handle refresh hosted events
  const handleRefreshHostedEvent = () => {
    setRefreshHostedEvents(!refreshHostedEvents);
  };

  // Fetch member detaiils
  const fetchMemberDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${memberId}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setMemberDetails(responseData);
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while fetching member details: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() || "Oops! Something went wrong. Please try again.",
      });
    }
  };

  // Update member personal info & skills
  const updateMemberInfo = async (updateInfo, type) => {
    let apiCall;
    if (type === "personalInfo") {
      editPersonalInfoModal.close();
      apiCall = `${import.meta.env.VITE_API_URL}/api/users/${memberId}`;
    } else {
      apiCall = `${import.meta.env.VITE_API_URL}/api/users/skill/${memberId}`;
    }
    try {
      const response = await fetch(apiCall, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Berear ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updateInfo),
      });
      if (response.ok) {
        const responseData = await response.json();
        setMemberDetails(responseData);
        notifications.show({
          color: "indigo",
          title: "Updated successfully",
        });
      } else if (response.status === 401) {
        logOutUser();
        navigate("/account/login");
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while updating personal Info: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() ||
          "Oops! Something went wrong. Please try after sometime.",
      });
    }
  };

  const handleStartChatClick = async () => {
    if (!isLoggedIn) {
      // If user is not logged in, button should navigate to Login
      toggleAuthForms("login", "true");
    } else {
      try {
        const conversationId = await createConversation(user.userId, memberId);
        navigate(`/direct/t/${conversationId}`);
      } catch (error) {
        console.error(
          error,
          " | Error while starting conversation with user:",
          memberId
        );
        notifications.show({
          color: "red",
          title: "Oops! Something went wrong. Please try after sometime.",
        });
      }
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, [memberId]);

  return (
    <>
      <Container fluid className={classes.ctn} pl={0} pr={0}>
        <Stack justify="space-between" gap={0}>
          <Paper
            h={rem(150)}
            radius={0}
            bg="light-dark(#A0B1B2, #2F4858)"
          ></Paper>
          <Paper radius={0} bg="light-dark(#F9FCFB, #CCD6D5)">
            <Group justify="center" align="flex-start">
              <Paper
                bg="light-dark(white, rgb(30,30,30))"
                h={450}
                w={250}
                style={{
                  position: "relative",
                  top: "-4rem",
                }}
              >
                <Avatar
                  src={
                    memberDetails.photo ? memberDetails.photo : no_gender_photo
                  }
                  size={170}
                  fit="cover"
                  radius={100}
                  fallbacksrc="https://placehold.co/600x400?text=Placeholder"
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <Stack
                  h={rem(200)}
                  justify="flex-start"
                  align="center"
                  style={{ width: "100%", position: "absolute", top: "52%" }}
                >
                  <Stack gap={2} align="center">
                    <Title
                      order={3}
                      ta="center"
                      c="light-dark(#2F4858,#A0B1B2)"
                    >
                      {memberDetails.fullName}
                    </Title>
                    <Text c="light-dark(black,white)">
                      {memberDetails.email}
                    </Text>
                  </Stack>
                  {user?.userId === memberId && isLoggedIn && (
                    <>
                      <Button
                        variant="outline"
                        radius="xl"
                        color="light-dark(#2F4858, #CCD6D5)"
                        onClick={editPersonalInfoModal.open}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        radius="xl"
                        color="light-dark(#2F4858, #CCD6D5)"
                        onClick={createEventModal.open}
                      >
                        Create Event
                      </Button>
                    </>
                  )}
                  {user?.userId !== memberId && (
                    <Button
                      variant="outline"
                      radius="xl"
                      color="light-dark(#2F4858, #CCD6D5)"
                      onClick={handleStartChatClick}
                    >{`Chat with ${memberDetails.firstName}`}</Button>
                  )}
                </Stack>
              </Paper>
              <Paper
                bg="light-dark(white, rgb(30,30,30))"
                h="100%"
                w="70%"
                mt={10}
                style={{
                  position: "relative",
                  top: "-2.85rem",
                }}
              >
                <Tabs
                  color="light-dark(#2f4858, #ccd6d5)"
                  value={activeTab}
                  onChange={setActiveTab}
                  pb={10}
                  classNames={{
                    tab: classes.tab,
                  }}
                >
                  <Tabs.List>
                    <Tabs.Tab value="PersonalInfo">Personal Info</Tabs.Tab>
                    <Tabs.Tab value="Hosted Events">Hosted Events</Tabs.Tab>
                    {user?.userId === memberId && isLoggedIn && (
                      <Tabs.Tab value="Joined Events">Joined Events</Tabs.Tab>
                    )}
                  </Tabs.List>
                  <Tabs.Panel value="PersonalInfo">
                    <MemberPersonalInfo
                      memberDetails={memberDetails}
                      updateMemberInfo={updateMemberInfo}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value="Hosted Events">
                    <MemberEvents
                      memberId={memberId}
                      refreshHostedEvents={refreshHostedEvents}
                    />
                  </Tabs.Panel>
                  {user?.userId === memberId && isLoggedIn && (
                    <Tabs.Panel value="Joined Events">
                      <MemberJoinedEvents memberId={memberId} />
                    </Tabs.Panel>
                  )}
                </Tabs>
              </Paper>
            </Group>
          </Paper>
        </Stack>
      </Container>

      {/* Update member modal */}
      <Modal
        padding="lg"
        radius="xl"
        opened={editPersonalInfoModal.opened}
        onClose={editPersonalInfoModal.close}
        size="lg"
        title="Personal Information"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <EditMemberModal
          userDetails={memberDetails}
          updateMemberInfo={updateMemberInfo}
        />
      </Modal>

      {/* Create event modal */}
      <Modal
        padding="lg"
        radius="xl"
        opened={createEventModal.opened}
        onClose={createEventModal.close}
        size="lg"
        title="Event"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <CreateEventModal
          userDetails={memberDetails}
          closeModal={createEventModal.close}
          handleRefreshHostedEvent={handleRefreshHostedEvent}
        />
      </Modal>
    </>
  );
};

export default MemberPage;
