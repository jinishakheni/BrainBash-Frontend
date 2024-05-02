import {
  Paper,
  Title,
  Text,
  Button,
  Container,
  Center,
  Box,
  rem,
  Flex,
  PasswordInput,
} from "@mantine/core";
import classes from "../../styles/ForgotPasswordPage.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { isValidPassword } from "../../helper/utils";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [error, setError] = useState("");

  const params = useParams();
  const { token } = params;

  const handleSendResetLink = async (event) => {
    event.preventDefault();

    if (!newPassword || !verifyNewPassword) {
      setError("Password is required");
      return;
    } else if (newPassword !== verifyNewPassword) {
      setError("Password has to match");
      return;
    } else if (!isValidPassword(newPassword)) {
      setError(
        "Password should contain at least one letter, one digit and one special character, and be at least 6 characters long."
      );
      return;
    }

    const payload = { newPassword };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        notifications.show({
          color: "indigo",
          title: "Password succesfully has changed",
        });
        navigate("/account/login");
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
    <Container size="md" className={classes.ctn}>
      <Title ta="center" mb="xs">
        Reset your password!
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter the password you would like to change.
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <PasswordInput
          label="New Password"
          placeholder="Your new password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.currentTarget.value)}
          required
          error={error}
        />

        <PasswordInput
          label="Verify New Password"
          placeholder="Verify your new password"
          value={verifyNewPassword}
          onChange={(event) => setVerifyNewPassword(event.currentTarget.value)}
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
          <Button
            variant="transparent"
            size="sm"
            p={0}
            onClick={() => navigate("/account/login")}
          >
            <Center inline>
              <FaArrowLeft
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Button>
          <Button onClick={handleSendResetLink}>Send reset link</Button>
        </Flex>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
