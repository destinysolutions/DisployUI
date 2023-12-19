import { useNavigate } from "react-router-dom";
import { auth } from "../FireBase/firebase";


const AdminNavbar = () => {
  //used for apply navigation
  const history = useNavigate();

  //for signout
  const handleSignOut = () => {
    localStorage.removeItem("hasSeenMessage");
    // localStorage.removeItem("user");
    localStorage.removeItem("userID");

    localStorage.setItem("role_access", "");
    window.location.reload();
    history("/");
    // auth.signOut();
  };

  return (
    // navbar component start
    <div className="w-full topbar  bg-white py-3 shadow-none">
      <div>
        <div className="flex-col flex">
          <div className="w-full">
            <div className=" justify-end items-center mx-auto px-4 flex relative">
              <button
                className="text-[#001737] font-bold text-base "
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // navbar component end
  );
};

export default AdminNavbar;
