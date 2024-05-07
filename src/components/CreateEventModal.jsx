// Module imports
import {
  Button,
  Image,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";

// Context import
import { CategoryContext } from "../contexts/CategoryContext";

// Helper import
import { isValidDuration } from "../helper/utils";

// Image import
import no_photo from "../assets/images/event_placeholder.jpg";

const CreateEventModal = ({ userDetails, closeModal, fetchMemberEvents }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [startingTime, setStartingTime] = useState(
    dayjs().startOf("day").toDate()
  );
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setSetImagUrl] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    startingTime: "",
    category: "",
    skills: "",
    duration: "",
    mode: "",
    address: "",
  });

  const { categories } = useContext(CategoryContext);

  // Set skills options based on category selection, that are added to host/user skills
  useEffect(() => {
    const userSkills = userDetails.skills.map((skill) => skill.skillName);
    const categorySkills = categories
      .find((category) => category.categoryName === selectedCategory)
      ?.skills.map((skill) => skill.skillName);
    if (categorySkills) {
      setSkills(userSkills.filter((skill) => categorySkills.includes(skill)));
    }
  }, [selectedCategory]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    let validationErrors = {};
    if (!title) validationErrors.title = "Title is required";
    if (!description) validationErrors.description = "Description is required";
    if (!selectedCategory) validationErrors.category = "Category is required";
    if (selectedSkills.length === 0)
      validationErrors.skill = "Skill is required";
    if (!startingTime) validationErrors.startingTime = "Time is required";
    if (!duration) validationErrors.duration = "Duration is required";
    else if (!isValidDuration(duration))
      validationErrors.duration =
        "Invalid duration format. It should be (hh)H(mm)M and duration should be less than 11H";
    if (!mode) validationErrors.mode = "Mode is required";
    if (!address) validationErrors.address = "Address is required";
    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      title,
      description,
      startingTime,
      category: selectedCategory,
      skills: selectedSkills,
      duration,
      mode,
      address,
      imageUrl,
      hostId: userDetails._id,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Berear ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        closeModal();
        notifications.show({
          color: "indigo",
          title: "Event created successfully",
        });
        fetchMemberEvents();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error while adding event: ", error);
      notifications.show({
        color: "red",
        title:
          error.toString() ||
          "Oops! Something went wrong. Please try after sometime.",
      });
    }
  };

  return (
    <Stack gap={15}>
      <TextInput
        variant="filled"
        radius="xl"
        label="Title"
        placeholder="Title"
        required
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        error={errors.title}
      />
      <Textarea
        variant="filled"
        radius="xl"
        label="Description"
        placeholder="Description"
        required
        rows={4}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        error={errors.description}
      />
      <Select
        variant="filled"
        radius="xl"
        label="Category"
        placeholder="Select Category"
        data={userDetails.categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
        error={errors.category}
        required
      />
      <MultiSelect
        variant="filled"
        radius="xl"
        label="Skills"
        placeholder="Select Skills"
        data={skills}
        value={selectedSkills}
        onChange={setSelectedSkills}
        error={errors.skill}
        required
      />
      <DateTimePicker
        variant="filled"
        radius="xl"
        valueFormat="DD MMM YYYY hh:mm A"
        label="Pick date and time"
        placeholder="Pick date and time"
        value={startingTime}
        onChange={setStartingTime}
        error={errors.startingTime}
        required
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Duration"
        placeholder="Duration in formate (12H30M)"
        required
        value={duration}
        onChange={(event) => setDuration(event.currentTarget.value)}
        error={errors.duration}
      />
      <Select
        variant="filled"
        radius="xl"
        label="Mode"
        placeholder="Mode"
        data={["Online", "Offline"]}
        value={mode}
        onChange={setMode}
        error={errors.mode}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Address"
        placeholder="Address"
        value={address}
        onChange={(event) => setAddress(event.currentTarget.value)}
        error={errors.address}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Photo"
        placeholder="Your Image URL"
        value={imageUrl}
        onChange={(event) => setSetImagUrl(event.currentTarget.value)}
      />

      <Image
        radius="xl"
        src={imageUrl ? imageUrl : no_photo}
        h="25rem"
        mt="xl"
      />

      <Button
        radius="xl"
        fullWidth
        mt="xl"
        variant="filled"
        onClick={handleSubmit}
      >
        Create Event
      </Button>
    </Stack>
  );
};

export default CreateEventModal;
