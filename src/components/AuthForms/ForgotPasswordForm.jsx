import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Center,
  Box,
  rem,
  Flex,
  Space,
} from "@mantine/core";
import classes from "../../styles/ForgotPasswordPage.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import ConditionalModal from "./ConditionalModel";
import { useAuthFormsContext } from "../../contexts/AuthFormsContext";

const ForgotPasswordForm = ({ email, setEmail }) => {
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const { formType, setFormType } = useAuthFormsContext();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    } else if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const payload = { email };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        notifications.show({
          color: "indigo",
          title: "Please check your email for the reset password link.",
        });
        setEmailSent(true);
      } else {
        const error = await response.json();
        notifications.show({
          color: "red",
          title: error.message,
        });
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Something went wrong. Try after sometime.",
      });
    }
    setError("");
  };

  return (
    <ConditionalModal>
      <Title order={3} mb="xs">
        Forgot your password?
      </Title>
      <Space h="md" />
      <Text c="dimmed" fz="sm" ta="center">
        Enter the email address associated with your account and we’ll email you
        a link to reset your password.
      </Text>
      <Space h="md" />
      <TextInput
        label="Your email"
        placeholder="email@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        required
        error={error}
      />
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column-reverse", sm: "row" }}
        gap={10}
        mt="lg"
      >
        {formType && (
          <Button
            variant="transparent"
            size="sm"
            p={0}
            onClick={() => setFormType("login")}
          >
            <Center inline>
              <FaArrowLeft
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
              <Box ml={5}>Back to the login</Box>
            </Center>
          </Button>
        )}
        {
          <Button onClick={handleSendResetLink} disabled={emailSent}>
            Send reset link
          </Button>
        }
      </Flex>
    </ConditionalModal>
  );
};

export default ForgotPasswordForm;
