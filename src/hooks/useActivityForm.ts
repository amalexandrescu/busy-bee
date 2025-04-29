import { useState } from "react";
import { ActivityUserEntrance } from "../types/ActivityUserEntrance";
import { CATEGORIES } from "../components/constants/categories";
import { predefinedColors } from "../components/constants/colors";

const useActivityForm = (initialActivity?: ActivityUserEntrance) => {
  const [activityName, setActivityName] = useState(initialActivity?.name ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialActivity?.category ?? CATEGORIES[0]
  );
  const [selectedColor, setSelectedColor] = useState(
    initialActivity?.color ?? predefinedColors[0].code
  );

  const resetForm = () => {
    setActivityName("");
    setSelectedCategory(CATEGORIES[0]);
    setSelectedColor(predefinedColors[0].code);
  };

  return {
    activityName,
    setActivityName,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
    resetForm,
  };
};

export default useActivityForm;
