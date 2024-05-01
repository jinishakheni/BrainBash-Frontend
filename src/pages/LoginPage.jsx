import { useToggle, upperFirst } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
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

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  //const [type, toggle] = useToggle(["login", "register"]);
  const { typeParam } = useParams();
  const [type, setType] = useState(typeParam);

  const navigate = useNavigate();

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

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length >= 6 ? null : "Password must have at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords must match",
      terms: (value) => value !== true,
    },
  });

  /* useEffect(() => {
    if (type !== typeParam) {
      toggle();
      console.log(typeParam);
      console.log(type);
    }
  }, []);*/

  // Function to handle form submission
  const handleSignupSubmit = (event) => {
    event.preventDefault();

    const errors = form.validate();

    if (!errors.hasErrors) {
      const requestBody = { email, password, firstName, lastName };

      // Make an axios request to the API
      // If the POST request is a successful redirect to the login page
      // If the request resolves with an error, set the error message in the state
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
        .then((response) => {
          console.log(response);
          //navigate("/login");
          navigate("/account/login");
        })
        .catch((error) => {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const errors = form.validate();

    if (!errors.hasErrors) {
      const requestBody = { email, password };

      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/login`, requestBody)
        .then((response) => {
          // Request to the server's endpoint `/auth/login` returns a response
          // with the JWT string ->  response.data.authToken
          console.log("JWT token", response.data.authToken);

          navigate("/");
        })
        .catch((error) => {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
          console.log(errorMessage);
        });
    }
  };

  const navigateToLogin = () => {
    setType("login");
    navigate("/account/login");
  };
  const navigateToRegister = () => {
    setType("register");
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
      <Container size="sm" style={{ width: "100%", maxWidth: "500px" }}>
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

          <form
            onSubmit={
              type === "register" ? handleSignupSubmit : handleLoginSubmit
            }
          >
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
                onClick={() => {}}
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
