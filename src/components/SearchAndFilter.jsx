import { Button, Container, Group, Menu, TextInput, rem } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CategoryContext } from "../contexts/CategoryContext";
import { useDebouncedValue } from "@mantine/hooks";

const SearchAndFilter = ({ page, fetchData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced] = useDebouncedValue(searchTerm, 200);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [skillMenuOpen, setSkillMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSkill, setSelectedSkill] = useState();
  const [selectedType, setSelectedType] = useState();
  const { categories } = useContext(CategoryContext);

  useEffect(() => {
    fetchData(
      searchTerm,
      selectedCategory?.categoryName,
      selectedSkill?.skillName,
      selectedType
    );
  }, [debounced]);

  const categoryMenuItems = categories.map((item) => (
    <Menu.Item
      key={item._id}
      onClick={() => {
        setSelectedCategory(item);
        setSelectedSkill();
        fetchData(searchTerm, item.categoryName, undefined, selectedType);
      }}
    >
      {item.categoryName}
    </Menu.Item>
  ));

  categoryMenuItems?.unshift(
    <Menu.Item
      key={"all"}
      onClick={() => {
        setSelectedCategory();
        fetchData(searchTerm, undefined, undefined, selectedType);
      }}
    >
      All Category
    </Menu.Item>
  );

  const skillMenuItems = selectedCategory?.skills?.map((item) => (
    <Menu.Item
      key={item._id}
      onClick={() => {
        setSelectedSkill(item);
        fetchData(
          searchTerm,
          selectedCategory.categoryName,
          item.skillName,
          selectedType
        );
      }}
    >
      {item.skillName}
    </Menu.Item>
  ));

  skillMenuItems?.unshift(
    <Menu.Item
      key={"all"}
      onClick={() => {
        setSelectedSkill();
        fetchData(
          searchTerm,
          selectedCategory.categoryName,
          undefined,
          selectedType
        );
      }}
    >
      All Skills
    </Menu.Item>
  );

  const types = ["All", "Online", "Offline"];
  const typeMenuItems = types.map((type) => (
    <Menu.Item
      key={type}
      onClick={() => {
        if (type === "All") {
          setSelectedType();
          fetchData(
            searchTerm,
            selectedCategory?.categoryName,
            selectedSkill?.skillName
          );
        } else {
          setSelectedType(type);
          fetchData(
            searchTerm,
            selectedCategory?.categoryName,
            selectedSkill?.skillName,
            type
          );
        }
      }}
    >
      {type}
    </Menu.Item>
  ));

  return (
    <>
      <Container fluid h={rem(50)} mb={rem(20)}>
        <Group justify="center" wrap="nowrap">
          <TextInput
            variant="filled"
            radius="xl"
            placeholder="Search..."
            leftSection={
              <FaSearch style={{ width: rem(16), height: rem(16) }} />
            }
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />

          {/* Category menu */}
          <Menu
            shadow="md"
            width={200}
            opened={categoryMenuOpen}
            onChange={setCategoryMenuOpen}
            position="bottom-end"
          >
            <Menu.Target>
              <Button
                variant="outline"
                radius="lg"
                color="light-dark(#2F4858, #CCD6D5)"
              >
                {selectedCategory
                  ? selectedCategory.categoryName
                  : "All Category"}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>{categoryMenuItems}</Menu.Dropdown>
          </Menu>

          {/* Skills menu */}
          {selectedCategory && (
            <Menu
              shadow="md"
              width={200}
              opened={skillMenuOpen}
              onChange={setSkillMenuOpen}
              position="bottom-start"
            >
              <Menu.Target>
                <Button
                  variant="outline"
                  radius="lg"
                  color="light-dark(#2F4858, #CCD6D5)"
                >
                  {selectedSkill ? selectedSkill.skillName : "All Skills"}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>{skillMenuItems}</Menu.Dropdown>
            </Menu>
          )}

          {/* Type menu */}
          {page === "event" && (
            <Menu
              shadow="md"
              width={200}
              opened={typeMenuOpen}
              onChange={setTypeMenuOpen}
              position="bottom-start"
            >
              <Menu.Target>
                <Button
                  variant="outline"
                  radius="lg"
                  color="light-dark(#2F4858, #CCD6D5)"
                >
                  {selectedType ? selectedType : "All Type"}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>{typeMenuItems}</Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </>
  );
};

export default SearchAndFilter;
