import React, { useState } from "react";
import MonthView from "./MonthView";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseAuth";
import ActivityModal from "../activities/modals/ActivityModal";
import useIsMobile from "../../hooks/useIsMobile";
import WeekView from "./WeekView";
import { Activity } from "../../types/Activity";
import ManageActivityModal from "../activities/modals/ManageActivityModal";

const CalendarView: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Store all activities
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  const openActivityModal = (date: string) => {
    setSelectedDate(date);
    fetchAllActivities(); //Just fetch suggestions
    setShowModal(true);
  };

  const closeActivityModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const fetchAllActivities = async () => {
    if (!user) return;

    // Fetch all activities
    const q = query(
      collection(db, "activities"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => doc.data() as Activity);

    const formattedActivities: Activity[] = activities.map((activity) => ({
      ...activity,
      name: activity.name,
      color: activity.color,
      category: activity.category,
    }));

    // Save all activities to show as suggestions
    setAllActivities(formattedActivities);
  };

  const handleSaveActivity = async (
    activityName: string,
    selectedColor: string,
    selectedCategory: string
  ) => {
    if (!selectedDate || !user || !selectedCategory) return;

    try {
      const dateObj = new Date(selectedDate);
      // Create a new activity
      await addDoc(collection(db, "activities"), {
        name: activityName,
        category: selectedCategory,
        activityDate: selectedDate,
        activityDateTimestamp: Timestamp.fromDate(dateObj),
        color: selectedColor,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      closeActivityModal(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving activity: ", error);
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteDoc(doc(db, "activities", id));
      setShowManageModal(false);
      setActivityToEdit(null);
    } catch (error) {
      console.error("Error deleting activity: ", error);
    }
  };

  // Handle save activity
  const handleEditActivity = async (
    activityName: string,
    selectedCategory: string,
    selectedColor: string
  ) => {
    if (activityToEdit?.id) {
      const activityRef = doc(db, "activities", activityToEdit.id);
      await updateDoc(activityRef, {
        name: activityName,
        category: selectedCategory,
        color: selectedColor,
      });
      setShowManageModal(false);
      setActivityToEdit(null);
    }
  };

  return (
    <div className="h-auto md:min-w-[700px] md:max-w-[1300px] md:rounded-lg mx-auto">
      {children}
      {isMobile ? (
        <WeekView
          openActivityModal={openActivityModal}
          setActivityToEdit={setActivityToEdit}
          setShowManageModal={setShowManageModal}
        />
      ) : (
        <MonthView
          openActivityModal={openActivityModal}
          setActivityToEdit={setActivityToEdit}
          setShowManageModal={setShowManageModal}
        />
      )}
      {showManageModal && activityToEdit && (
        <ManageActivityModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          onDelete={() => {
            if (activityToEdit?.id) handleDeleteActivity(activityToEdit.id);
          }}
          onSave={handleEditActivity}
          selectedActivity={activityToEdit}
        />
      )}
      {!activityToEdit && (
        <ActivityModal
          isOpen={showModal}
          onClose={closeActivityModal}
          onSave={handleSaveActivity}
          selectedDate={selectedDate}
          activities={allActivities}
        />
      )}
    </div>
  );
};

export default CalendarView;
