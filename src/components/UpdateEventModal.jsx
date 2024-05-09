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
import no_photo from "../assets/images/no_photo.png";
import { DateTimePicker } from "@mantine/dates";
import { isValidDuration } from "../helper/utils";
import { CategoryContext } from "../contexts/CategoryContext";

const UpdateEventModal = ({ eventDetails, updateEventInfo }) => {
  const [title, setTitle] = useState(eventDetails.title);
  const [description, setDescription] = useState(eventDetails.description);
  const [startingTime, setStartingTime] = useState(
    new Date(eventDetails.startingTime)
  );
  const [duration, setDuration] = useState(eventDetails.duration);
  const [mode, setMode] = useState(eventDetails.mode);
  const [address, setAddress] = useState(eventDetails.address);
  const [imageUrl, setSetImagUrl] = useState(eventDetails.imageUrl);
  const [categoryList, setCategoryList] = useState([]);
  const { categories } = useContext(CategoryContext);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    startingTime: "",
    duration: "",
    mode: "",
    address: "",
  });

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    let validationErrors = {};
    if (!title) validationErrors.title = "Title is required";
    if (!description) validationErrors.description = "Description is required";
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
      duration,
      mode,
      address,
      imageUrl,
    };
    updateEventInfo(payload);
  };

  useEffect(() => {
    setCategoryList(
      categories.map((currentCategory) => currentCategory.categoryName)
    );
  }, []);

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
        data={categoryList}
        value={eventDetails.category}
        disabled
      />
      <MultiSelect
        variant="filled"
        radius="xl"
        label="Skill"
        placeholder="Select Skill"
        value={eventDetails.skills}
        disabled
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
        Update Event
      </Button>
    </Stack>
  );
};

export default UpdateEventModal;
