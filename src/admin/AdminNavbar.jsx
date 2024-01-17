import { useNavigate } from "react-router-dom";
import { auth } from "../FireBase/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleLogout } from "../Redux/Authslice";

const AdminNavbar = () => {
  const dispatch = useDispatch();

  return (
    // navbar component start
    <div className="w-full topbar  bg-white py-3 shadow-none">
      <div>
        <div className="flex-col flex">
          <div className="w-full">
            <div className=" justify-end items-center mx-auto px-4 flex relative">
              <button
                className="text-[#001737] font-bold text-base "
                onClick={() => dispatch(handleLogout())}
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
