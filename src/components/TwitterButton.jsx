import { Button } from "@mantine/core";
import { FacebookIcon } from "@mantinex/dev-icons";

export function TwitterButton() {
  return (
    <Button
      leftSection={
        <FacebookIcon
          style={{ width: "1rem", height: "1rem" }}
          color="#00ACEE"
        />
      }
      variant="default"
    />
  );
}
