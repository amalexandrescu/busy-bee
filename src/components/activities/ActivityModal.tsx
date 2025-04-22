import React, { useState } from "react";
import ColorPicker from "./ColorPicker";
import { predefinedColors } from "../constants/colors";
import { CATEGORIES, Category } from "../constants/categories";
import { formatDate } from "../../utils/datehelpers";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    activityName: string,
    selectedColor: string,
    selectedCategory: string
  ) => void;
  selectedDate: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}) => {
  const [activityName, setActivityName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    CATEGORIES[0]
  ); // Default to first category
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0].code); // Default to first color

  const handleColorSelect = (colorCode: string) => {
    setSelectedColor(colorCode);
  };

  const handleSave = () => {
    if (!activityName) return;
    onSave(activityName, selectedColor, selectedCategory);
    resetForm();
  };

  // Reset form state
  const resetForm = () => {
    setActivityName(""); // Reset activity name
    setSelectedCategory(CATEGORIES[0]); // Reset to first category
    setSelectedColor(predefinedColors[0].code); // Reset to first color
  };

  if (!isOpen) return null;

  const formattedDate = selectedDate ? formatDate(selectedDate) : "";

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-4 rounded-lg w-96">
          {selectedDate && (
            <h2 className="text-lg font-semibold mb-2">
              Add Activity for {formattedDate}
            </h2>
          )}

          <div>
            <label className="block text-sm font-medium">Activity Name</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Color Picker Component */}
          <ColorPicker
            onColorSelect={handleColorSelect}
            selectedColor={selectedColor}
          />

          {/* Category */}
          <div className="py-4">
            <label className="block text-sm font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="w-full border rounded p-2 mt-1"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ActivityModal;
