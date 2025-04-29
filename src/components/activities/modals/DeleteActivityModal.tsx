// components/DeleteConfirmationModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import { ActivityUserEntrance } from "../../../types/ActivityUserEntrance";

interface IDeleteActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedActivity: ActivityUserEntrance;
}

const DeleteActivityModal: React.FC<IDeleteActivityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedActivity,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-80 shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete {selectedActivity.name} activity?
            </h2>
            <div className="flex justify-between mt-6">
              <Button onClick={onClose} variant="contained">
                No
              </Button>
              <Button onClick={onConfirm} color="error">
                Yes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteActivityModal;
