// Module imports
import { Button, Select, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

// Context import
import { CategoryContext } from "../contexts/CategoryContext";

const AddEditSkillModal = ({ skillDetail, AddEditSkillHandler }) => {
  const [category, setCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(skillDetail.skillName);
  const [proficiency, setProficiency] = useState(skillDetail.proficiency);
  const [errors, setErrors] = useState({
    category: "",
    skill: "",
    proficiency: "",
  });

  const { categories } = useContext(CategoryContext);

  useEffect(() => {
    // selecte category based on skill
    if (selectedSkill) {
      setSelectedCategory(
        categories.filter((currentCategory) => {
          if (
            currentCategory.skills.findIndex(
              (skill) => skill.skillName === skillDetail.skillName
            ) >= 0
          )
            return currentCategory;
        })[0]?.categoryName
      );
    }
    // set category to array of all category names
    setCategory(
      categories.map((currentCategory) => currentCategory.categoryName)
    );
  }, []);

  useEffect(() => {
    // update skills option based on category selection
    setSkills(
      categories
        .find((category) => category.categoryName === selectedCategory)
        ?.skills.map((currentSkill) => currentSkill.skillName)
    );
  }, [selectedCategory]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    let validationErrors = {};
    if (!selectedCategory) validationErrors.category = "Category is required";
    if (!selectedSkill) validationErrors.skill = "Skill is required";
    if (!proficiency) validationErrors.proficiency = "Proficiency is required";
    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      skillName: selectedSkill,
      category: selectedCategory,
      proficiency,
      opration: skillDetail.opration,
    };
    AddEditSkillHandler(payload);
  };

  return (
    <Stack gap={15}>
      <Select
        variant="filled"
        radius="xl"
        label="Category"
        placeholder="Select Category"
        data={category}
        value={selectedCategory}
        onChange={setSelectedCategory}
        error={errors.category}
        disabled={skillDetail.opration === "update"}
        required
      />

      <Select
        variant="filled"
        radius="xl"
        label="Skill"
        placeholder="Select Skill"
        data={skills}
        value={selectedSkill}
        onChange={setSelectedSkill}
        error={errors.skill}
        disabled={skillDetail.opration === "update"}
        required
      />

      <Select
        variant="filled"
        radius="xl"
        label="Proficiency"
        placeholder="Select Proficiency"
        data={["Beginner", "Intermediate", "Advanced"]}
        value={proficiency}
        onChange={setProficiency}
        error={errors.proficiency}
        required
      />

      <Button
        radius="xl"
        fullWidth
        mt="xl"
        variant="filled"
        onClick={handleSubmit}
      >
        {skillDetail.opration === "update" ? "Update Skill" : "Add Skill"}
      </Button>
    </Stack>
  );
};

export default AddEditSkillModal;
