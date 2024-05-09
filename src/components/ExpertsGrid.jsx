// Module imports
import {
  Avatar,
  Badge,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Title,
  rem,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import classes from "../styles/ExpertsGrid.module.css";
import { useContext } from "react";
import { CategoryContext } from "../contexts/CategoryContext";

//Image imports
const no_gender_photo = "../assets/images/no_photo.png";

const ExpertsGrid = ({ list }) => {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);

  return (
    <Grid
      overflow="hidden"
      justify="center"
      gutter={{ base: 20, md: 25, xl: 30 }}
      className={classes.gridContainer}
    >
      {list?.map((currentMember) => {
        return (
          <Grid.Col
            key={currentMember._id}
            span={{ base: 12, xs: 6, md: 4, lg: 3 }}
            style={{ height: rem(460) }}
          >
            <Paper radius="md" shadow="xs" m="sm" p="sm" h={rem(300)}>
              <Container fluid h={rem(110)} bg="#c3ebfa">
                <Avatar
                  src={
                    currentMember.photo ? currentMember.photo : no_gender_photo
                  }
                  size={170}
                  fit="cover"
                  radius={100}
                  fallbacksrc="https://placehold.co/600x400?text=Placeholder"
                  onClick={() => navigate(`/members/${currentMember._id}`)}
                  style={{
                    zIndex: 1,
                    border: "10px solid white",
                    position: "relative",
                    top: "90%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </Container>
              <Container fluid h={rem(150)}>
                <Stack
                  align="center"
                  style={{
                    width: "100%",
                    position: "relative",
                    top: "50%",
                  }}
                  gap={5}
                >
                  <Title order={3} ta="center">
                    {currentMember.fullName}
                  </Title>
                  <Group justify="space-evenly" gap={5}>
                    {currentMember?.categories
                      ?.slice(0, 3)
                      .map((item, index) => (
                        <Badge
                          key={index}
                          color={
                            categories.find((ele) => ele.categoryName === item)
                              ?.color
                          }
                        >
                          {item}
                        </Badge>
                      ))}
                  </Group>
                </Stack>
              </Container>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default ExpertsGrid;
