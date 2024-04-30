import { useToggle, upperFirst } from "@mantine/hooks";
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  // Function to handle form submission
  const handleSignupSubmit = (event) => {
    event.preventDefault();
    console.log("Signing up...");
    console.log("Loging in...");
    console.log("email:", email);
    console.log("Password:", password);
    console.log("Fist Name:", firstName);
    console.log("Last Name:", lastName);

    const requestBody = { email, password, firstName, lastName };

    // Make an axios request to the API
    // If the POST request is a successful redirect to the login page
    // If the request resolves with an error, set the error message in the state
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
      .then((response) => {
        console.log(response);
        //navigate("/login");
        toggle();
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log("Loging in...");
    console.log("email:", email);
    console.log("Password:", password);

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
      });
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
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={handlePassword}
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />

              {type === "register" && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => toggle()}
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
