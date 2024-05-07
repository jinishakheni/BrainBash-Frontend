// Import modules
import {
  Button,
  Image,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";

// Import image
import no_photo from "../assets/images/no_photo.png";

// Import helper
import { isValidEmail, isValidLink } from "../helper/utils";

const EditMemberModal = ({ userDetails, updateMemberInfo }) => {
  const [firstName, setFirstName] = useState(userDetails.firstName);
  const [lastName, setLastName] = useState(userDetails.lastName);
  const [email, setEmail] = useState(userDetails.email);
  const [bio, setBio] = useState(userDetails.bio || "");
  const [gender, setGender] = useState(userDetails.gender);
  const [nationality, setNationality] = useState(userDetails.nationality);
  const [dateOfBirth, setDateOfBirth] = useState(
    userDetails.dateOfBirth &&
      dayjs(userDetails.dateOfBirth).startOf("day").toDate()
  );
  const [photo, setPhoto] = useState(userDetails.photo);
  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    photo: "",
  });

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    let validationErrors = {};
    if (!firstName) validationErrors.name = "First name is required";
    if (!email) validationErrors.email = "Email is required";
    else if (!isValidEmail(email))
      validationErrors.email = "Invalid email format";
    if (photo && !isValidLink(photo)) validationErrors.photo = "Invalid URL";
    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      firstName,
      lastName,
      fullName: firstName + " " + lastName,
      email,
      bio,
      gender,
      nationality,
      photo,
      dateOfBirth,
    };
    updateMemberInfo(payload, "personalInfo");
  };

  return (
    <Stack gap={15}>
      <TextInput
        variant="filled"
        radius="xl"
        label="First Name"
        placeholder="First name"
        required
        value={firstName}
        onChange={(event) => setFirstName(event.currentTarget.value)}
        error={errors.name}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Last Name"
        placeholder="Last name"
        value={lastName}
        onChange={(event) => setLastName(event.currentTarget.value)}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Email"
        placeholder="example@domain.com"
        required
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        error={errors.email}
      />
      <Textarea
        variant="filled"
        radius="xl"
        label="Bio"
        placeholder="Write about your self..."
        value={bio}
        rows={4}
        onChange={(event) => setBio(event.currentTarget.value)}
      />
      <Select
        variant="filled"
        radius="xl"
        label="Gender"
        placeholder="Gender"
        data={["Female", "Male"]}
        value={gender}
        onChange={setGender}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Nationality"
        placeholder="Nationality"
        value={nationality}
        onChange={(event) => setNationality(event.currentTarget.value)}
      />
      <DateInput
        variant="filled"
        radius="xl"
        valueFormat="DD/MM/YYYY"
        label="Date of Birth"
        placeholder="Date of Birth"
        allowDeselect
        value={dateOfBirth}
        onChange={setDateOfBirth}
      />
      <TextInput
        variant="filled"
        radius="xl"
        label="Photo"
        placeholder="Your Image URL"
        value={photo}
        onChange={(event) => setPhoto(event.currentTarget.value)}
        error={errors.photo}
      />

      <Image radius="xl" src={photo ? photo : no_photo} h="25rem" mt="xl" />

      <Button
        radius="xl"
        fullWidth
        mt="xl"
        variant="filled"
        onClick={handleSubmit}
      >
        Update Information
      </Button>
    </Stack>
  );
};

export default EditMemberModal;
