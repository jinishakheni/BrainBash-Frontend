import { Avatar, Container, Group, Text } from "@mantine/core";
import logoImg from "../assets/images/logo.png";
import classes from "../styles/Footer.module.css";
import { MdCopyright } from "react-icons/md";

export function Footer() {
  return (
    <Container
      fluid
      className={classes.ctn}
      pl={{ base: 10, md: 70 }}
      pr={{ base: 10, md: 70 }}
    >
      <Group justify="space-between">
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
