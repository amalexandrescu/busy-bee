import React, { useEffect, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";

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

const WeekView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarMonths, setCalendarMonths] = useState<CalendarMonth[]>([]);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const loadingUpRef = useRef(false);

  // Initialize calendar
  useEffect(() => {
    const now = new Date();
    const initialMonth = generateMonthData(now);
    setCalendarMonths([initialMonth]);
    setVisibleMonth(initialMonth.date);
  }, []);

  const loadMoreMonths = useCallback((direction: "up" | "down") => {
    if (!containerRef.current) return;
    if (direction === "up" && loadingUpRef.current) return;
    if (direction === "up") loadingUpRef.current = true;

    const container = containerRef.current;
    const prevScrollTop = container.scrollTop;

    setCalendarMonths((prev) => {
      if (direction === "down") {
        const base = new Date(prev[prev.length - 1].date);
        const newMonth = new Date(base.getFullYear(), base.getMonth() + 1);
        return [...prev, generateMonthData(newMonth)];
      } else {
        const base = new Date(prev[0].date);
        const newMonths: CalendarMonth[] = [];
        for (let i = 1; i <= 3; i++) {
          const newMonth = new Date(base.getFullYear(), base.getMonth() - i);
          newMonths.unshift(generateMonthData(newMonth));
        }
        return [...newMonths, ...prev];
      }
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
  }, []);

  const debouncedLoadMoreDown = useCallback(
    debounce(() => loadMoreMonths("down"), 200),
    [loadMoreMonths]
  );

  // Track visible month in real time on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const monthElements = Array.from(
        container.querySelectorAll("[data-month]")
      ) as HTMLDivElement[];

      const containerTop = container.scrollTop;

      type ClosestMonth = {
        el: HTMLDivElement;
        offset: number;
      };

      let closestMonth: ClosestMonth | null = null;

      monthElements.forEach((el: HTMLDivElement) => {
        const offsetTop = el.offsetTop;
        const distance = Math.abs(offsetTop - containerTop);

        if (!closestMonth || distance < closestMonth.offset) {
          closestMonth = {
            el,
            offset: distance,
          };
        }
      });
      if (closestMonth !== null) {
        const id = (closestMonth as ClosestMonth).el.getAttribute("data-id");
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

  // Setup sentinel observer
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
      {/* Sticky Month Header */}
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

      {calendarMonths.map((month) => (
        <div key={month.id} data-month data-id={month.id} className="mb-4">
          <div className="grid grid-cols-7 gap-1">
            {/* Month label aligned with first day */}
            <div
              style={{
                gridColumnStart: month.startOffset + 1,
                gridColumnEnd: month.startOffset + 2,
              }}
              className="text-sm font-semibold mb-1"
            >
              {month.date.toLocaleString("default", { month: "short" })}
            </div>

            {/* Spacer for rest of row (so label doesn't push layout) */}
            {Array.from({ length: 7 - month.startOffset - 1 }).map((_, i) => (
              <div key={`label-spacer-${month.id}-${i}`} />
            ))}

            {/* Empty slots before the first day */}
            {Array.from({ length: month.startOffset }).map((_, i) => (
              <div key={`empty-${month.id}-${i}`} />
            ))}

            {/* Day cells */}
            {month.daysInMonth.map((day) => (
              <div
                key={`${month.id}-day-${day}`}
                className="h-[13rem] w-full border rounded-lg flex items-center justify-center bg-gray-100"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div id="bottom-sentinel" className="w-full h-1" />
    </div>
  );
};

export default WeekView;
