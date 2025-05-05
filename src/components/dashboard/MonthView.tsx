import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatLocalDate, getMonthRange } from "../../utils/datehelpers";
import { Activity } from "../../types/Activity";
import {
  collection,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseAuth";
import { useAuth } from "../../context/AuthContext";
import ActivityPill from "../activities/ActivityPill";
import LogOut from "../auth/LogOut";

export interface ICalendarViewsProps {
  openActivityModal: (date: string) => void;
  setActivityToEdit: React.Dispatch<React.SetStateAction<Activity | null>>;
  setShowManageModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDownloadReport: (date: Date) => void;
}

const MonthView: React.FC<ICalendarViewsProps> = ({
  openActivityModal,
  setActivityToEdit,
  setShowManageModal,
  onDownloadReport,
}) => {
  const [date, setDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);
  const [monthActivities, setMonthActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // In-memory cache keyed by "YYYY-MM"
  const activityCache = useRef<Map<string, Activity[]>>(new Map());
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const days = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));

    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    setStartOffset(offset);

    if (!user) return;

    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Check cache first
    if (activityCache.current.has(monthKey)) {
      setMonthActivities(activityCache.current.get(monthKey)!);
      return;
    }

    // Unsubscribe from previous snapshot
    if (unsubRef.current) unsubRef.current();

    setLoading(true);

    const { start, end } = getMonthRange(date);
    const q = query(
      collection(db, "activities"),
      where("userId", "==", user.uid),
      where("activityDateTimestamp", ">=", start),
      where("activityDateTimestamp", "<=", end)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Activity),
      }));
      activityCache.current.set(monthKey, data);
      setMonthActivities(data);
      setLoading(false);
    });

    unsubRef.current = unsubscribe;

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [user, date]);

  const goToPreviousMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDate((next) => new Date(next.getFullYear(), next.getMonth() + 1, 1));
  };

  const activitiesByDate = monthActivities.reduce((acc, activity) => {
    if (!acc[activity.activityDate]) acc[activity.activityDate] = [];
    acc[activity.activityDate].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const hasActivityForMonth = monthActivities.length > 0;

  return (
    <div className="p-4">
      <div className="flex gap-4 items-center justify-between mb-4">
        {/* Add the "Download Report" button */}
        <div className="pl-1.5 text-center">
          <button
            disabled={!hasActivityForMonth}
            onClick={() => onDownloadReport(date)}
            className={`bg-blue-500 text-white p-2 rounded-lg ${
              hasActivityForMonth
                ? "hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Download Activity Report
          </button>
        </div>
        <div className="flex gap-4 font-bold items-center">
          <span>{user?.displayName}</span>
          <LogOut />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={goToNextMonth}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {daysInMonth.map((day) => {
            const fullDate = formatLocalDate(
              new Date(date.getFullYear(), date.getMonth(), day)
            );
            const dayActivities = activitiesByDate[fullDate] || [];
            return (
              <div
                key={day}
                onClick={() => openActivityModal(fullDate)}
                className="cursor-pointer h-32 w-full border rounded-lg flex flex-col items-center justify-start p-1 bg-gray-100 hover:bg-gray-200"
              >
                <div className="font-medium text-left w-full">{day}</div>
                <div className="w-full space-y-1 mt-1 overflow-y-auto">
                  {dayActivities.map((act, index) => (
                    <div key={index}>
                      <ActivityPill
                        name={act.name}
                        color={act.color}
                        onClick={(e) => {
                          e.stopPropagation(); // Important to avoid triggering day click
                          setActivityToEdit(act);
                          setShowManageModal(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonthView;
