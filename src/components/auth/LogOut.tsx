import { logOut } from "../../firebase/firebaseAuth";
import { LogOutIcon } from "lucide-react";

const LogOut = () => {
  return (
    <button
      onClick={logOut}
      className="md:p-2 rounded-md hover:bg-gray-200 transition"
      title="Logout"
    >
      <LogOutIcon className="w-5 h-5" />
    </button>
  );
};

export default LogOut;
