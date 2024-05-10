import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const ContactUsPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message, subject } = form.values; // Access the name field from form.values object

    if (name && email && message && subject) {
      try {
        const payload = {
          senderEmail: email,
          senderName: name,
          senderMessage: message,
          senderSubject: subject,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          console.log("Email sent succesfully");
          form.reset();
        }
      } catch (error) {
        console.log(error, "on submmitting form");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 4rem)",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
          fw={900}
          ta="center"
        >
          Get in touch
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="Name"
            placeholder="Your name"
            name="name"
            variant="filled"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            variant="filled"
            {...form.getInputProps("email")}
          />
        </SimpleGrid>

        <TextInput
          label="Subject"
          placeholder="Subject"
          mt="md"
          name="subject"
          variant="filled"
          {...form.getInputProps("subject")}
        />
        <Textarea
          mt="md"
          label="Message"
          placeholder="Your message"
          maxRows={10}
          minRows={5}
          autosize
          name="message"
          variant="filled"
          {...form.getInputProps("message")}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Send message
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default ContactUsPage;
