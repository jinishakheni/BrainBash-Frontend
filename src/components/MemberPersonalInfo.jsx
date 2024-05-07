import {
  Badge,
  Container,
  Group,
  Modal,
  Rating,
  ScrollArea,
  Table,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { MdAddCircle, MdDelete, MdModeEditOutline } from "react-icons/md";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import classes from "../styles/MemberPage.module.css";
import DeleteSkillModal from "./DeleteSkillModal";
import AddEditSkillModal from "./AddEditSkillModal";
import { CategoryContext } from "../contexts/CategoryContext";
import { AuthContext } from "../contexts/AuthContext";

const MemberPersonalInfo = ({ memberDetails, updateMemberInfo }) => {
  const { categories } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const [prefillSkillDetail, setPrefillSkillDetail] = useState({
    skillName: "",
    proficiency: "",
    opration: "add",
  });

  // Handle skill modal
  let [opened, { open, close }] = useDisclosure(false);
  const skillModal = { opened, open, close };

  // Handle delete skill modal
  [opened, { open, close }] = useDisclosure(false);
  const deleteSkillModal = { opened, open, close };

  const AddEditSkillHandler = (dataToUpdate) => {
    skillModal.close();
    updateMemberInfo(dataToUpdate, "skillInfo");
  };

  const deleteSkillHandler = (dataToDelete) => {
    deleteSkillModal.close();
    const category = categories.filter((currentCategory) => {
      if (
        currentCategory.skills.findIndex(
          (skill) => skill.skillName === dataToDelete.skillName
        ) >= 0
      )
        return currentCategory;
    })[0];

    let categoryCount = 0;
    memberDetails.skills.forEach((skill) => {
      if (
        category.skills.findIndex((ele) => ele.skillName === skill.skillName) >=
        0
      ) {
        categoryCount += 1;
      }
    });
    if (categoryCount === 1) dataToDelete.category = category.categoryName;
    updateMemberInfo(dataToDelete, "skillInfo");
  };

  return (
    <>
      <Container className={classes.section}>
        <Title order={4}>About me</Title>
        <Text>{memberDetails.bio}</Text>
      </Container>
      <Container className={classes.section}>
        <Group align="center">
          <Title order={4}>Skills</Title>
          {memberDetails._id === user?.userId && (
            <UnstyledButton
              onClick={() => {
                setPrefillSkillDetail({
                  skillName: "",
                  proficiency: "",
                  opration: "add",
                });
                skillModal.open();
              }}
            >
              <MdAddCircle size={20} />
            </UnstyledButton>
          )}
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Skill</Table.Th>
              <Table.Th>Proficiency</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th>Given by</Table.Th>
              {memberDetails._id === user?.userId && (
                <Table.Th>Edit/Delete</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {memberDetails.skills?.length ? (
              memberDetails.skills.map((currentSkill) => (
                <Table.Tr key={currentSkill.skillName}>
                  <Table.Td>
                    <Badge color="teal">{currentSkill.skillName}</Badge>
                  </Table.Td>
                  <Table.Td>{currentSkill.proficiency}</Table.Td>
                  <Table.Td>
                    <Rating defaultValue={currentSkill.ratingScore} readOnly />
                  </Table.Td>
                  <Table.Td>{currentSkill.ratingCount}</Table.Td>
                  {memberDetails._id === user?.userId && (
                    <Table.Td>
                      <UnstyledButton
                        onClick={() => {
                          setPrefillSkillDetail({
                            skillName: currentSkill.skillName,
                            proficiency: currentSkill.proficiency,
                            opration: "update",
                          });
                          skillModal.open();
                        }}
                      >
                        <MdModeEditOutline size={20} />
                      </UnstyledButton>
                      <UnstyledButton
                        onClick={() => {
                          setPrefillSkillDetail({
                            skillName: currentSkill.skillName,
                          });
                          deleteSkillModal.open();
                        }}
                      >
                        <MdDelete size={20} />
                      </UnstyledButton>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text weight={500} align="center">
                    No skills found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Container>
      <Container className={classes.section}>
        <Group justify="space-between" className={classes.section}>
          <Container ml={0} pl={0}>
            <Title order={4}>Date of Birth</Title>
            <Text>
              {memberDetails.dateOfBirt
                ? dayjs(memberDetails.dateOfBirth).format("MM/DD/YYYY")
                : "-"}
            </Text>
          </Container>
          <Container ml={0}>
            <Title order={4}>Gender</Title>
            <Text>{memberDetails.gender || "-"}</Text>
          </Container>
          <Container ml={0}>
            <Title order={4}>Nationality</Title>
            <Text>{memberDetails.nationality || "-"}</Text>
          </Container>
        </Group>
      </Container>

      {/* Update skill modal */}
      <Modal
        padding="lg"
        radius="xl"
        opened={skillModal.opened}
        onClose={skillModal.close}
        size="lg"
        title="Skill"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <AddEditSkillModal
          skillDetail={prefillSkillDetail}
          AddEditSkillHandler={AddEditSkillHandler}
        />
      </Modal>

      {/* Delete skill modal */}
      <Modal
        padding="xl"
        radius="xl"
        size="lg"
        opened={deleteSkillModal.opened}
        onClose={deleteSkillModal.close}
        title="Confirm Deletion"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <DeleteSkillModal
          skillDetail={prefillSkillDetail}
          deleteSkillHandler={deleteSkillHandler}
        />
      </Modal>
    </>
  );
};

export default MemberPersonalInfo;
