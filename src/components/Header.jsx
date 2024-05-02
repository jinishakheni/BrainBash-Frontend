// TODO Responsive header needs to be implemented

// Module imports
import {
  Avatar,
  Container,
  Group,
  Menu,
  Tabs,
  UnstyledButton,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";

// Component inport
import ColorScheme from "../components/ColorScheme";

// Logo import
import logoImg from "../assets/images/logo.png";

// Styles import
import classes from "../styles/Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  // Create tab
  const tabsList = ["Events", "Experts"];
  const tabItems = tabsList.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  let userList = [
    {
      key: "my_profile",
      tab: "My Profile",
      link: `/users/${JSON.parse(localStorage.getItem("user"))?.userId}`,
    },
    {
      key: "logout",
      tab: "Logout",
      link: "/",
    },
  ];
  const userDropDownItems = userList.map((item) => (
    <Menu.Item key={item.key}>{item.tab}</Menu.Item>
  ));

  return (
    <Container fluid className={classes.ctn} pl={70} pr={70}>
      <Group justify="space-between" gap={20}>
        {/* App logo */}
        <Avatar
          src={logoImg}
          alt={"App Logo"}
          radius="xs"
          size={60}
          onClick={() => navigate("/")}
        />

        {/* Tabs */}
        <Container size="sm" ml={20} mr={20}>
          <Tabs
            defaultValue="Events"
            visibleFrom="xs"
            onChange={(value) => navigate(`/${value.toLowerCase()}`)}
            classNames={{
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>{tabItems}</Tabs.List>
          </Tabs>
        </Container>

        {/* User settings */}
        <Group gap={{ base: "sm", sm: "md", lg: "xl" }}>
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
          <ColorScheme />
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
