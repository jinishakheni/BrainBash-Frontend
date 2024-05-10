// Module imports
import {
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

// CSS import
import classes from "../styles/EventsGrid.module.css";

const EventsGrid = ({ list }) => {
  const navigate = useNavigate();

  return (
    <Grid
      overflow="hidden"
      justify="center"
      w="75%"
      gutter={{ base: 20, md: 25, xl: 30 }}
      className={classes.gridContainer}
    >
      {list?.map((currentItem) => {
        return (
          <Grid.Col
            key={currentItem._id}
            span={{ base: 12, xs: 6, md: 4, lg: 3 }}
          >
            <Card
              shadow="lg"
              padding="lg"
              radius="md"
              h={rem(290)}
              withBorder
              bg="light-dark(#F9FCFB, #778D92)"
            >
              <Card.Section>
                <Image
                  src={currentItem.imageUrl}
                  h={180}
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                  onClick={() => navigate(`/events/${currentItem._id}`)}
                />
              </Card.Section>
              <Stack justify="space-between">
                <Tooltip
                  label={currentItem.title}
                  position="top-start"
                  offset={0}
                  withArrow
                >
                  <Title
                    order={5}
                    mt="xs"
                    c="#2F4858"
                    style={{
                      whiteSpace: "nowrap", // Prevent text from wrapping
                      overflow: "hidden", // Hide overflowed text
                      textOverflow: "ellipsis", // Display ellipsis for overflowed text
                    }}
                  >
                    {currentItem.title}
                  </Title>
                </Tooltip>
                <Stack gap={2} align="flex-start" c="#4D635C">
                  <Group justify="space-between" className={classes.text}>
                    <Text size="sm" c="light-dark(#516A74, #F9FCFB)">
                      <strong>Date:</strong>{" "}
                      {currentItem.startingTime.split("T")[0]}
                    </Text>
                    {currentItem.mode === "Online" && (
                      <Text c="light-dark(#00A984, #354B45)">Online</Text>
                    )}
                  </Group>
                  <Text
                    size="sm"
                    c="light-dark(#2F4858, #2F4858)"
                  >{`by ${currentItem.hostId.firstName}  ${currentItem.hostId.lastName}`}</Text>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default EventsGrid;
