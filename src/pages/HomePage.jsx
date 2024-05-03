import { useContext, useEffect } from "react";
import { CategoryContext } from "../contexts/CategoryContext";

const HomePage = () => {
  const { fetchCategories } = useContext(CategoryContext);
  useEffect(() => {
    fetchCategories();
  }, []);
  return <h1>Home Page</h1>;
};

export default HomePage;
