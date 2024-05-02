import { upperFirst } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
} from "@mantine/core";
import { GoogleButton } from "../components/GoogleButton";
import { GithubButton } from "../components/GithubIcon";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function LoginPage(props) {
  // Setting up hooks for form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  // Getting the route parameter (login or register) and storing in a hook
  const { typeParam } = useParams();
  const [type, setType] = useState(typeParam);

  // Navigate hook
  const navigate = useNavigate();

  // Function to show error notifications
  const showError = (type, message) => {
    notifications.show({
      title: type.toUpperCase() + " ERROR: ",
      message: message,
      color: "red", // Set the notification color to red
    });
  };

  // Functions to handle changes in the form
  const handleEmail = (e) => {
    setEmail(e.target.value);
    form.setFieldValue("email", e.target.value);
    form.errors.email = false;
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    form.setFieldValue("password", e.target.value);
    form.setFieldError("password", null);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    form.setFieldValue("confirmPassword", e.target.value);
    form.errors.confirmPassword = false;
  };
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);

  // Setting up form component from Mantine
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: false,
    },

    // Validating functions for each input
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length >= 6 ? null : "Password must have at least 6 characters",
      confirmPassword: (value, values) =>
        type !== "register" || value === values.password
          ? null
          : "Passwords must match",
      terms: (value) => type === "register" && value !== true,
    },
  });

  // Function to handle form submission
  const handleSubmit = (event) => {
    // Depending if user is on register or login
    if (type === "register") {
      event.preventDefault();

      // Check for errors in the form
      const errors = form.validate();

      // If no errors, then proceed to communicate with server
      if (!errors.hasErrors) {
        const requestBody = { email, password, firstName, lastName };
        // Make an axios request to the API
        // If the POST request is a successful redirect to the login page
        // If the request resolves with an error, set the error message in the state
        axios
          .post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
          .then((response) => {
            //console.log("User succesfully created", response);
            navigateToLogin();
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message);
            //console.log(errorMessage);
            showError(type, error.response.data.message);
          });
      }
    } else if (type === "login") {
      event.preventDefault();

      // Check for errors in the form
      const errors = form.validate();

      if (!errors.hasErrors) {
        const requestBody = { email, password };

        // If login is successfull, navigate to main page
        axios
          .post(`${import.meta.env.VITE_API_URL}/auth/login`, requestBody)
          .then((response) => {
            // Request to the server's endpoint `/auth/login` returns a response
            // with the JWT string ->  response.data.authToken
            console.log("JWT token", response.data.authToken);
            notifications.clean();
            setErrorMessage("");
            navigate("/");
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message);
            console.log(error);
            showError(type, error.response.data.message);
          });
      }
    }
  };

  // Functions to navigate to Login or Register, clearing notifications and error messages
  const navigateToLogin = () => {
    setType("login");
    notifications.clean();
    setErrorMessage("");
    navigate("/account/login");
  };
  const navigateToRegister = () => {
    setType("register");
    notifications.clean();
    setErrorMessage("");
    navigate("/account/register");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Container style={{ width: "fluid", maxWidth: "500px" }}>
        <Paper
          radius="md"
          p="xl"
          withBorder
          shadow="md"
          style={{ margin: "auto", maxWidth: "500px" }}
          {...props}
        >
          <Text size="lg" fw={500}>
            Welcome to BrainBash, {type} with
          </Text>

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
            <GithubButton radius="xl">Github</GithubButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={handleSubmit}>
            <Stack>
              {type === "register" && (
                <>
                  <TextInput
                    label="First Name"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={handleFirstName}
                    radius="md"
                  />

                  <TextInput
                    label="Last Name"
                    placeholder="Your last name"
                    value={lastName}
                    onChange={handleLastName}
                    radius="md"
                  />
                </>
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@brainbash.com"
                value={email}
                onChange={handleEmail}
                error={form.errors.email}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={handlePassword}
                error={form.errors.password}
                radius="md"
              />

              {type === "register" && (
                <>
                  <PasswordInput
                    required
                    label="Confirm Password"
                    placeholder="Confirm Your password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    error={
                      form.errors.confirmPassword &&
                      "Both passwords should match"
                    }
                    radius="md"
                  />

                  <Checkbox
                    label="I accept terms and conditions"
                    checked={form.values.terms}
                    onChange={(event) =>
                      form.setFieldValue("terms", event.currentTarget.checked)
                    }
                    error={
                      form.errors.terms &&
                      "Terms and conditions must be accepted"
                    }
                  />
                </>
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => {
                  type === "register"
                    ? navigateToLogin()
                    : navigateToRegister();
                }}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => {
                  navigate("/forgot-password");
                }}
                size="xs"
              >
                {"Forgot your password?"}
              </Anchor>
              <Button type="submit" radius="xl">
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
