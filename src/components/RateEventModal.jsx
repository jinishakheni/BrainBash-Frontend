import { Button, Rating } from "@mantine/core";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const RateEventModal = ({ event, updateEvent }) => {
  const [rating, setRating] = useState(0);
  const { user } = useContext(AuthContext);
  const handleSubmit = () => {
    console.log({ event, rating });
    const ratingBy = event.ratingBy ? event.ratingBy.length : 0;
    const payload = {
      rating: event.rating
        ? (event.rating * ratingBy + rating) / (ratingBy + 1)
        : rating,
      ratingBy: [...event.ratingBy, user.userId],
    };
    updateEvent(event._id, payload);
  };
  return (
    <>
      <Rating
        value={rating}
        fractions={2}
        size="xl"
        onChange={setRating}
        mb="md"
      />
      <Button
        variant="outline"
        radius="xl"
        color="light-dark(#2F4858, #CCD6D5)"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
};

export default RateEventModal;
