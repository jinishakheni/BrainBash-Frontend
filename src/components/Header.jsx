import { Avatar, Button, Container, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/images/logo.png";
import ColorScheme from "../components/ColorScheme";
import classes from "../styles/Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Container fluid className={classes.ctn}>
      <Group justify="space-around">
        <Avatar
          src={logoImg}
          alt={"App Logo"}
          radius="xs"
          size={60}
          onClick={() => navigate("/")}
        />
        <Container>
          <Group justify="space-around">
            <Button variant="filled">Login</Button>
            <ColorScheme />
          </Group>
        </Container>
      </Group>
    </Container>
  );
};

export default Header;
