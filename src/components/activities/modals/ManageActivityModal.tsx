import { useState } from "react";
import DeleteActivityModal from "./DeleteActivityModal";
import EditActivityModal from "./EditActivityModal";
import { Activity } from "../../../types/Activity";

interface IManageActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (
    activityName: string,
    selectedCategory: string,
    selectedColor: string
  ) => void;
  selectedActivity: Activity;
}

const ManageActivityModal: React.FC<IManageActivityModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSave,
  selectedActivity,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      {!showConfirmDelete ? (
        <EditActivityModal
          onClose={onClose}
          onSave={onSave}
          showConfirmDelete={showConfirmDelete}
          handleSetShowConfirmDelete={setShowConfirmDelete}
          selectedActivity={selectedActivity}
        />
      ) : (
        <div className="flex flex-col items-center">
          <DeleteActivityModal
            isOpen={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={() => {
              onDelete();
              setShowConfirmDelete(false);
            }}
            selectedActivity={selectedActivity}
          />
        </div>
      )}
    </div>
  );
};
export default ManageActivityModal;
