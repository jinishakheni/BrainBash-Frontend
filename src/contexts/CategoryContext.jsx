import { notifications } from "@mantine/notifications";
import { createContext, useEffect, useState } from "react";

const CategoryContext = createContext();

const CategoryContextWrapper = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    if (!categories.length) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories`
        );
        if (response.ok) {
          const responseData = await response.json();
          setCategories(responseData);
        } else {
          throw new Error(response);
        }
      } catch (error) {
        console.error("Error while fetching categories: ", error);
        notifications.show({
          color: "red",
          title: "Something went wrong. Try to refresh page",
        });
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContextWrapper, CategoryContext };
