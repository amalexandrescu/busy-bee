import { Button } from "@mui/material";
import { CATEGORIES, Category } from "../../constants/categories";
import ColorPicker from "../ColorPicker";
import React, { useState } from "react";
import useActivityForm from "../../../hooks/useActivityForm";
import { ActivityUserEntrance } from "../../../types/ActivityUserEntrance";
import { X } from "lucide-react";

interface IEditActivityModalProps {
  onClose: () => void;
  onSave: (
    activityName: string,
    selectedCategory: string,
    selectedColor: string
  ) => void;
  showConfirmDelete: boolean;
  handleSetShowConfirmDelete: (value: boolean) => void;
  selectedActivity: ActivityUserEntrance;
}

const EditActivityModal: React.FC<IEditActivityModalProps> = ({
  onClose,
  onSave,
  showConfirmDelete,
  handleSetShowConfirmDelete,
  selectedActivity,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    activityName,
    setActivityName,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
  } = useActivityForm(selectedActivity);

  return (
    <div className="relative bg-white p-4 rounded-lg w-96">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h2 className="text-lg font-semibold mb-2 mt-2">Activity Details</h2>
      <div>
        <label className="block text-sm font-medium">Activity Name</label>
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          disabled={!isEditing}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <ColorPicker
        onColorSelect={setSelectedColor}
        selectedColor={selectedColor}
        disabled={!isEditing}
      />

      <div className="py-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category)}
          disabled={!isEditing}
          className="w-full border rounded p-2 mt-1"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {!showConfirmDelete && (
        <div className="flex justify-end gap-3">
          <Button
            color="error"
            onClick={() => handleSetShowConfirmDelete(true)}
          >
            Delete
          </Button>

          {!isEditing ? (
            <Button
              color="primary"
              variant="contained"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                onSave(activityName, selectedCategory, selectedColor);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditActivityModal;
