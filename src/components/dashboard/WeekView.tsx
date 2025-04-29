import React, { useEffect, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { formatLocalDate, getMonthRange } from "../../utils/datehelpers";
import { Activity } from "../../types/Activity";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseAuth";
import { useAuth } from "../../context/AuthContext";
import ActivityPill from "../activities/ActivityPill";

interface CalendarMonth {
  id: string;
  date: Date;
  daysInMonth: number[];
  startOffset: number;
}

const generateMonthData = (baseDate: Date): CalendarMonth => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const days = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: days }, (_, i) => i + 1);

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return {
    id: `${year}-${month}`,
    date: new Date(year, month),
    daysInMonth,
    startOffset: offset,
  };
};

interface IWeekViewProps {
  openActivityModal: (date: string) => void;
  setActivityToEdit: React.Dispatch<React.SetStateAction<Activity | null>>;
  setShowManageModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeekView: React.FC<IWeekViewProps> = ({
  openActivityModal,
  setActivityToEdit,
  setShowManageModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarMonths, setCalendarMonths] = useState<CalendarMonth[]>([]);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const loadingUpRef = useRef(false);
  const activityCache = useRef<Map<string, Activity[]>>(new Map());
  const listeners = useRef<Map<string, () => void>>(new Map());
  const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set());

  const { user } = useAuth();

  const fetchMonthActivities = useCallback(
    (month: CalendarMonth) => {
      const key = month.id;

      if (activityCache.current.has(key) || listeners.current.has(key) || !user)
        return;

      setLoadingMonths((prev) => new Set(prev).add(key));

      const { start, end } = getMonthRange(month.date);
      const q = query(
        collection(db, "activities"),
        where("userId", "==", user.uid),
        where("activityDateTimestamp", ">=", start),
        where("activityDateTimestamp", "<=", end)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Activity),
        }));
        activityCache.current.set(key, data);
        setLoadingMonths((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      });

      listeners.current.set(key, unsub);
    },
    [user]
  );

  useEffect(() => {
    const now = new Date();
    const initialMonth = generateMonthData(now);
    setCalendarMonths([initialMonth]);
    setVisibleMonth(initialMonth.date);
    fetchMonthActivities(initialMonth);

    return () => {
      listeners.current.forEach((unsub) => unsub());
      listeners.current.clear();
    };
  }, [fetchMonthActivities]);

  const loadMoreMonths = useCallback(
    (direction: "up" | "down") => {
      if (!containerRef.current) return;
      if (direction === "up" && loadingUpRef.current) return;
      if (direction === "up") loadingUpRef.current = true;

      const container = containerRef.current;
      const prevScrollTop = container.scrollTop;

      setCalendarMonths((prev) => {
        let newMonths: CalendarMonth[] = [];
        if (direction === "down") {
          const base = new Date(prev[prev.length - 1].date);
          const newMonth = new Date(base.getFullYear(), base.getMonth() + 1);
          newMonths = [generateMonthData(newMonth)];
        } else {
          const base = new Date(prev[0].date);
          for (let i = 1; i <= 3; i++) {
            const newMonth = new Date(base.getFullYear(), base.getMonth() - i);
            newMonths.unshift(generateMonthData(newMonth));
          }
        }

        newMonths.forEach(fetchMonthActivities);
        return direction === "down"
          ? [...prev, ...newMonths]
          : [...newMonths, ...prev];
      });

      if (direction === "up") {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;

            const monthElems = Array.from(
              container.querySelectorAll("[data-month]")
            ) as HTMLDivElement[];

            const insertedHeights = monthElems
              .slice(0, 3)
              .reduce((total, el) => total + el.offsetHeight, 0);

            container.scrollTop = prevScrollTop + insertedHeights;
            loadingUpRef.current = false;
          });
        });
      }
    },
    [fetchMonthActivities]
  );

  const debouncedLoadMoreDown = useCallback(
    debounce(() => loadMoreMonths("down"), 200),
    [loadMoreMonths]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const monthElements = Array.from(
        container.querySelectorAll("[data-month]")
      ) as HTMLDivElement[];

      const containerTop = container.scrollTop;

      let closestMonth: { el: HTMLDivElement; offset: number } | null = null;

      for (const el of monthElements) {
        const offsetTop = el.offsetTop;
        const distance = Math.abs(offsetTop - containerTop);

        if (!closestMonth || distance < closestMonth.offset) {
          closestMonth = { el, offset: distance };
        }
      }

      if (closestMonth) {
        const id = closestMonth.el.getAttribute("data-id");
        if (id) {
          const [year, month] = id.split("-").map(Number);
          const newDate = new Date(year, month);
          setVisibleMonth((prev) => {
            if (
              !prev ||
              prev.getMonth() !== newDate.getMonth() ||
              prev.getFullYear() !== newDate.getFullYear()
            ) {
              return newDate;
            }
            return prev;
          });
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [calendarMonths]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.target.id === "top-sentinel") {
            loadMoreMonths("up");
          } else if (entry.target.id === "bottom-sentinel") {
            debouncedLoadMoreDown();
          }
        }
      }
    }, observerOptions);

    const topSentinel = document.getElementById("top-sentinel");
    const bottomSentinel = document.getElementById("bottom-sentinel");

    if (topSentinel) observer.observe(topSentinel);
    if (bottomSentinel) observer.observe(bottomSentinel);

    return () => observer.disconnect();
  }, [debouncedLoadMoreDown, loadMoreMonths]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white text-xl font-bold border-b border-gray-400">
        <div className="pl-5 py-2">
          {visibleMonth?.toLocaleString("default", {
            month: "long",
            year: "numeric",
          }) ?? ""}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs pb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
      </div>

      <div id="top-sentinel" className="w-full h-1" />

      {calendarMonths.map((month) => {
        const key = month.id;
        const activities = activityCache.current.get(key) || [];
        const activitiesByDate = activities.reduce((acc, activity) => {
          if (!acc[activity.activityDate]) acc[activity.activityDate] = [];
          acc[activity.activityDate].push(activity);
          return acc;
        }, {} as Record<string, Activity[]>);

        return (
          <div key={month.id} data-month data-id={month.id} className="mb-4">
            <div className="grid grid-cols-7 gap-1">
              <div
                style={{
                  gridColumnStart: month.startOffset + 1,
                  gridColumnEnd: month.startOffset + 2,
                }}
                className="text-sm font-semibold mb-1"
              >
                {month.date.toLocaleString("default", { month: "short" })}
              </div>

              {Array.from({ length: 7 - month.startOffset - 1 }).map((_, i) => (
                <div key={`label-spacer-${month.id}-${i}`} />
              ))}

              {Array.from({ length: month.startOffset }).map((_, i) => (
                <div key={`empty-${month.id}-${i}`} />
              ))}

              {month.daysInMonth.map((day) => {
                const fullDate = formatLocalDate(
                  new Date(month.date.getFullYear(), month.date.getMonth(), day)
                );
                const dayActivities = activitiesByDate[fullDate] || [];

                return (
                  <div
                    key={`${month.id}-day-${day}`}
                    onClick={() => openActivityModal(fullDate)}
                    className="cursor-pointer h-[13rem] w-full border rounded-lg flex flex-col items-start justify-start bg-gray-100 hover:bg-gray-200 p-1 overflow-hidden"
                  >
                    <div className="font-medium">{day}</div>
                    <div className="mt-1 space-y-1 w-full">
                      {dayActivities.map((activity, index) => (
                        <div key={index}>
                          <ActivityPill
                            name={activity.name}
                            color={activity.color}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivityToEdit(activity);
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
            {loadingMonths.has(month.id) && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Loading...
              </div>
            )}
          </div>
        );
      })}
      <div id="bottom-sentinel" className="w-full h-1" />
    </div>
  );
};

export default WeekView;
