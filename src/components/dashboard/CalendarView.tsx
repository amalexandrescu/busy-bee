import React, { useState } from "react";
import MonthView from "./MonthView";
import { useAuth } from "../../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseAuth";
import ActivityModal from "../activities/ActivityModal";
import useIsMobile from "../../hooks/useIsMobile";
import WeekView from "./WeekView";

const CalendarView: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const openActivityModal = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const closeActivityModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const handleSaveActivity = async (
    activityName: string,
    selectedColor: string,
    selectedCategory: string
  ) => {
    if (!selectedDate || !user || !selectedCategory) return;

    try {
      // Reference to the 'logs' sub-collection of the selected activity date
      const activityRef = collection(
        db,
        "users",
        user.uid,
        "activities",
        selectedDate,
        "logs"
      );

      // Add a new log to the 'logs' sub-collection
      await addDoc(activityRef, {
        name: activityName,
        category: selectedCategory,
        color: selectedColor,
        createdAt: serverTimestamp(),
      });

      // Close modal or perform other UI updates after saving
      closeActivityModal();
    } catch (error) {
      console.error("Error saving activity: ", error);
    }
  };

  return (
    <div className="h-auto md:min-w-[700px] md:max-w-[1300px] md:rounded-lg mx-auto">
      {children}
      {isMobile ? (
        <WeekView openActivityModal={openActivityModal} />
      ) : (
        <MonthView openActivityModal={openActivityModal} />
      )}
      <ActivityModal
        isOpen={showModal}
        onClose={closeActivityModal}
        onSave={handleSaveActivity}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarView;
