import { Route, Routes } from "react-router-dom";
import LogIn from "../components/auth/LogIn";
import Register from "../components/auth/Register";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
};

export default Navigation;
