import {
  useMantineColorScheme,
  useComputedColorScheme,
  UnstyledButton,
} from "@mantine/core";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ColorScheme = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <UnstyledButton
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      style={{ display: "flex", alignItems: "center" }}
    >
      {computedColorScheme === "light" ? (
        <MdOutlineDarkMode size={20} />
      ) : (
        <MdOutlineLightMode size={20} />
      )}
    </UnstyledButton>
  );
};

export default ColorScheme;
