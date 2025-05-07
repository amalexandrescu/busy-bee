import { Navigate, Route, Routes } from "react-router-dom";
import LogIn from "../components/auth/LogIn";
import Register from "../components/auth/Register";
import CalendarView from "../components/dashboard/CalendarView";
import NotFound from "../components/routing/NotFound";
import PrivateRoute from "../components/routing/PrivateRoute";

const Navigation = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<CalendarView />} />
      </Route>
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Navigation;
