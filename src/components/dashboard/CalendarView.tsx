import React, { useState } from "react";
import MonthView from "./MonthView";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseAuth";
import ActivityModal from "../activities/ActivityModal";
import useIsMobile from "../../hooks/useIsMobile";
import WeekView from "./WeekView";
import { Activity } from "../../types/Activity";
import { ActivityUserEntrance } from "../../types/ActivityUserEntrance";

const CalendarView: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [previousActivity, setPreviousActivity] = useState<Activity | null>(
    null
  );
  const [allActivities, setAllActivities] = useState<ActivityUserEntrance[]>(
    []
  ); // Store all activities

  const openActivityModal = (date: string) => {
    setSelectedDate(date);
    fetchPreviousActivity(date); // Fetch previous activity for selected date
    setShowModal(true);
  };

  const closeActivityModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setPreviousActivity(null); // Reset previous activity when modal closes
  };

  const fetchPreviousActivity = async (date: string) => {
    if (!user) return;

    // Fetch all activities
    const q = query(
      collection(db, "activities"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => doc.data() as Activity);

    const formattedActivities = activities.map((activity) => ({
      name: activity.name,
      color: activity.color,
      category: activity.category,
    }));

    setAllActivities(formattedActivities); // Save all activities to show as suggestions

    // Fetch the latest activity on the selected date
    const activitiesOnDate = activities.filter(
      (activity) => activity.activityDate === date
    );
    if (activitiesOnDate.length > 0) {
      setPreviousActivity(activitiesOnDate[activitiesOnDate.length - 1]);
    } else {
      setPreviousActivity(null); // No activity found, reset previous activity
    }
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
        previousActivity={previousActivity} // Pass the previous activity to the modal
        activities={allActivities} // Pass all activities to the modal for suggestions
      />
    </div>
  );
};

export default CalendarView;
