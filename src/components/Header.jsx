// TODO Responsive header needs to be implemented

// Module imports
import {
  Avatar,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Menu,
  Tabs,
  Title,
  UnstyledButton,
  em,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa6";

// Component inport
import ColorScheme from "../components/ColorScheme";
import MessageIcon from "./MessageIcon";

// Logo import
import logoImg from "../assets/images/logo.png";

// Styles import
import classes from "../styles/Header.module.css";
import { AuthContext } from "../contexts/AuthContext";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useAuthFormsContext } from "../contexts/AuthFormsContext";

const Header = () => {
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  const [menuDrawerOpened, menuDrawer] = useDisclosure(false);
  const [openedTab, setOpenedTab] = useState("Home");
  const isMobile = useMediaQuery(`(max-width: ${em(500)})`);

  const { toggleAuthForms } = useAuthFormsContext();

  // Create tab
  const tabsList = ["Home", "Events", "Experts"];
  const tabItems = tabsList.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  let userList = [
    {
      key: "my_profile",
      tab: "My Profile",
      link: `/members/${user?.userId}`,
    },
    {
      key: "logout",
      tab: "Logout",
      link: "/",
    },
  ];
  const userDropDownItems = userList.map((item) => (
    <Menu.Item
      key={item.key}
      onClick={() => {
        if (item.key === "logout") {
          logOutUser();
        }
        navigate(item.link);
      }}
    >
      {item.tab}
    </Menu.Item>
  ));

  return (
    <>
      <Container
        fluid
        className={classes.ctn}
        pl={{ base: 10, md: 70 }}
        pr={{ base: 10, md: 70 }}
      >
        <Group justify="space-between">
          <Group justify="space-between" gap={5}>
            <Burger
              opened={menuDrawerOpened}
              onClick={menuDrawer.open}
              hiddenFrom="sm"
              size="sm"
            />

            {/* App logo */}
            <Avatar src={logoImg} alt={"App Logo"} radius="xs" size={60} />
          </Group>
          {/* Tabs */}
          <Container size="sm" ml={20} mr={20} visibleFrom="sm">
            <Tabs
              defaultValue={openedTab}
              onChange={(value) => {
                value === "Home"
                  ? navigate(`/`)
                  : navigate(`/${value.toLowerCase()}`);
                setOpenedTab(value);
              }}
              classNames={{
                list: classes.tabsList,
                tab: classes.tab,
              }}
            >
              <Tabs.List>{tabItems}</Tabs.List>
            </Tabs>
          </Container>

          {/* User settings */}
          <Group gap={{ sm: "md", lg: "xl" }} wrap="nowrap" align="center">
            {isLoggedIn ? (
              <>
                <MessageIcon />

                <Menu
                  width={200}
                  position="bottom"
                  withArrow
                  shadow="md"
                  opened={userMenuOpened}
                  onChange={setUserMenuOpened}
                  transitionProps={{ transition: "pop-top-right" }}
                  withinPortal
                  trigger="click-hover"
                >
                  <Menu.Target>
                    <UnstyledButton className={classes.userIcon}>
                      <FaRegUser size={25} />
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown> {userDropDownItems} </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  size={isMobile ? "xs" : "sm"}
                  onClick={() => {
                    toggleAuthForms("login", "true");
                  }}
                >
                  Log in
                </Button>
                <Button
                  size={isMobile ? "xs" : "sm"}
                  onClick={() => {
                    toggleAuthForms("register", "true");
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
            <ColorScheme />
          </Group>
        </Group>
      </Container>
      <Drawer.Root
        opened={menuDrawerOpened}
        onClose={menuDrawer.close}
        size={200}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Group justify="flex-start" gap={5}>
                <Avatar
                  src={logoImg}
                  alt={"App Logo"}
                  radius="xs"
                  size={45}
                  onClick={() => navigate("/")}
                />
                <Title order={5}>BrainBash</Title>
              </Group>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <Tabs
              variant="pills"
              defaultValue={openedTab}
              orientation="vertical"
              onChange={(value) => {
                value === "Home"
                  ? navigate(`/`)
                  : navigate(`/${value.toLowerCase()}`);
                setOpenedTab(value);
                menuDrawer.close();
              }}
              classNames={{
                list: classes.tabsList,
                root: { width: "100%" },
              }}
            >
              <Tabs.List>{tabItems}</Tabs.List>
            </Tabs>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

export default Header;
