import React, { useState } from "react";
import ColorPicker from "../ColorPicker";
import { CATEGORIES, Category } from "../../constants/categories";
import { formatDate } from "../../../utils/datehelpers";
import { ActivityUserEntrance } from "../../../types/ActivityUserEntrance";
import useActivityForm from "../../../hooks/useActivityForm";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    activityName: string,
    selectedColor: string,
    selectedCategory: string
  ) => void;

  selectedDate: string | null;
  activities: ActivityUserEntrance[]; //for previous activities
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  activities,
}) => {
  const {
    activityName,
    setActivityName,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
    resetForm,
  } = useActivityForm();

  const [suggestions, setSuggestions] = useState<ActivityUserEntrance[]>([]);

  // Helper function to get unique activity suggestions
  const getUniqueActivities = (activities: ActivityUserEntrance[]) => {
    const seen = new Set(); // Set to keep track of unique names
    return activities.filter((activity) => {
      if (seen.has(activity.name)) {
        return false; // Skip if already seen
      }
      seen.add(activity.name); // Add activity name to the set
      return true; // Keep the first occurrence
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setActivityName(value);

    // If input is empty, clear suggestions
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = activities.filter((activity) =>
      activity.name.toLowerCase().startsWith(value.toLowerCase())
    );

    // Get only unique suggestions based on the name
    const uniqueSuggestions = getUniqueActivities(filteredSuggestions);

    // Update the suggestions with unique activities
    setSuggestions(uniqueSuggestions);
  };

  //when you select an existing activity from the suggestions
  const handleSuggestionClick = (activity: ActivityUserEntrance) => {
    setActivityName(activity.name);
    setSelectedCategory(activity.category);
    setSelectedColor(activity.color);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleColorSelect = (colorCode: string) => {
    setSelectedColor(colorCode);
  };

  //save the activity
  const handleSave = () => {
    if (!activityName) return;
    onSave(activityName, selectedColor, selectedCategory);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const formattedDate = selectedDate ? formatDate(selectedDate) : "";

  return (
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
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-1"
          />

          {/* Display suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 border border-gray-300 rounded">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
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
  );
};

export default ActivityModal;
