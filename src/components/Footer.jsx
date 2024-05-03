import { Avatar, Container, Group, Text } from "@mantine/core";
import logoImg from "../assets/images/logo.png";
import classes from "../styles/Footer.module.css";
import { MdCopyright } from "react-icons/md";

export function Footer() {
  return (
    <Container fluid className={classes.ctn} pl={70} pr={70}>
      <Group justify="space-between" gap={20}>
        {/* App logo */}
        <Avatar src={logoImg} alt={"App Logo"} radius="xs" size={60} />

        {/* Copyright */}
        <Group justify="center" gap={3}>
          <MdCopyright /> <Text size="sm">2024 BrainBash, Inc.</Text>
        </Group>
      </Group>
    </Container>
  );
}
