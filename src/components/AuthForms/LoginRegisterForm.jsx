import { upperFirst } from "@mantine/hooks";
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
import { GoogleButton } from "../GoogleButton";
import { GithubButton } from "../GithubIcon";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { isValidPassword } from "../../helper/utils.jsx";
import ConditionalModal from "./ConditionalModel";
import { useAuthFormsContext } from "../../contexts/AuthFormsContext";

const LoginRegisterForm = ({ email, setEmail }) => {
  // Setting up hooks for form data
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // this hook allows to disable buttons while system is connecting with backend
  const [isLoading, setIsLoading] = useState(false);

  // Getting the route parameter (login or register) and storing in a hook
  const { formType, setFormType, showModal, toggleAuthForms } =
    useAuthFormsContext();

  // Navigate hook
  const navigate = useNavigate();

  // Auth context
  const { storeToken, verifyToken } = useContext(AuthContext);

  // On back and forward, change type to login or register.

  // Function to show error notifications
  const showNotification = (page, type, message) => {
    notifications.show({
      title:
        page === "register"
          ? `Registration ${type === "error" ? "error" : "success"}`
          : `Login ${type === "error" ? "error" : "success"}`,
      color: type === "error" ? "red" : "indigo", // Set the notification color based on type
      message: message,
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
        formType !== "register" || isValidPassword(value)
          ? null
          : "Password should contain at least one letter, one digit and one special character, and be at least 6 characters long.",
      confirmPassword: (value, values) =>
        formType !== "register" || value === values.password
          ? null
          : "Passwords must match",
      terms: (value) => formType === "register" && value !== true,
    },
  });

  // Function to handle form submission
  const handleSubmit = (event) => {
    // Depending if user is on register or login
    if (formType === "register") {
      event.preventDefault();

      // Check for errors in the form
      const errors = form.validate();

      // If no errors, then proceed to communicate with server
      if (!errors.hasErrors) {
        // Start loading state
        setIsLoading(true);

        const requestBody = { email, password, firstName, lastName };
        // Make an axios request to the API
        // If the POST request is a successful redirect to the login page
        // If the request resolves with an error, set the error message in the state
        axios
          .post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
          .then((response) => {
            if (response.status === 201) {
              // TODO Show registration success notification
              showNotification(formType, "success", "Signup is succesful");
              setTimeout(navigateToLogin, 1000);
            } else {
              throw new Error(response);
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
            showNotification(formType, "error", error.response.data.message);
          })
          .finally(() => setIsLoading(false)); // Stop loading state ;
      }
    } else if (formType === "login") {
      event.preventDefault();

      // Check for errors in the form
      const errors = form.validate();

      if (!errors.hasErrors) {
        // Start loading state
        setIsLoading(true);
        const requestBody = { email, password };

        // If login is successfull, navigate to main page
        axios
          .post(`${import.meta.env.VITE_API_URL}/auth/login`, requestBody)
          .then((response) => {
            if (response.status === 200) {
              storeToken(response.data.token);
              notifications.clean();
              toggleAuthForms("", false);
              navigate("/");
              verifyToken();
            } else {
              throw new Error();
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
            showNotification(formType, "error", error.response.data.message);
          })
          .finally(() => setIsLoading(false)); // Stop loading state;
      }
    }
  };

  // Functions to navigate to Login or Register, clearing notifications and error messages
  const navigateToLogin = () => {
    setFormType("login");
    notifications.clean();
    if (!showModal) {
      navigate("/account/login");
    }
  };
  const navigateToRegister = () => {
    setFormType("register");
    notifications.clean();
    if (!showModal) {
      navigate("/account/register");
    }
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
      <ConditionalModal>
        <Container style={{ fluid: "true" }}>
          <Paper
            radius="md"
            p="xl"
            withBorder
            shadow="md"
            style={{ margin: "auto", maxWidth: "500px" }}
          >
            <Text size="lg" fw={500}>
              Welcome to BrainBash, {formType} with
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
                {formType === "register" && (
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

                {formType === "register" && (
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
                    formType === "register"
                      ? navigateToLogin()
                      : navigateToRegister();
                  }}
                  size="xs"
                >
                  {formType === "register"
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </Anchor>
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={() => {
                    setFormType("forgotpassword");
                  }}
                  size="xs"
                >
                  {"Forgot your password?"}
                </Anchor>
                <Group justify="space-between">
                  <Button type="submit" radius="xl" disabled={isLoading}>
                    {upperFirst(formType)}
                  </Button>
                </Group>
              </Group>
            </form>
          </Paper>
        </Container>
      </ConditionalModal>
    </div>
  );
};

export default LoginRegisterForm;
