import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: You can use icons or just text like "<" and ">"

const MonthView: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startOffset, setStartOffset] = useState<number>(0);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get total days in month
    //new Date(year, month, day) => give me the last day of the previous month
    const days = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));

    // Get day of the week for the 1st of the month (0 = Sunday, 6 = Saturday)
    const firstDay = new Date(year, month, 1).getDay();

    // Adjust to start from Monday (0 = Monday, 6 = Sunday)
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    setStartOffset(offset);
  }, [date]);

  const goToPreviousMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDate((next) => new Date(next.getFullYear(), next.getMonth() + 1, 1));
  };

  return (
    <div className="p-4">
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
      {/* Grid for weekday headers and dates */}
      <div className="grid grid-cols-7 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map((day) => (
          <div
            key={day}
            className="h-20 w-full border rounded-lg flex items-center justify-center bg-gray-100"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
