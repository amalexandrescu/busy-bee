import { Route, Routes } from "react-router-dom";
import LogIn from "../components/auth/LogIn";
import Register from "../components/auth/Register";
import CalendarView from "../components/dashboard/CalendarView";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/dashboard" element={<CalendarView />}></Route>
    </Routes>
  );
};

export default Navigation;
