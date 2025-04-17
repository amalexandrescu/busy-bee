import MonthView from "./MonthView";
import WeekView from "./WeekView";
import useIsMobile from "../../hooks/useIsMobile";

const CalendarView: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile();
  return (
    <div className="h-auto md:min-w-[700px] md:max-w-[1300px] md:rounded-lg mx-auto">
      {children}
      {isMobile ? <WeekView /> : <MonthView />}
    </div>
  );
};

export default CalendarView;
