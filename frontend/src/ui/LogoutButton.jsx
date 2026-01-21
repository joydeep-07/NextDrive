import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // clear redux auth state
    localStorage.removeItem("token"); // remove JWT (if stored)
    navigate("/"); // redirect to home
  };

  return (
    <button
      onClick={handleLogout}
      className="
        px-5 py-2 rounded-full
        text-sm font-medium
        border border-[var(--border-light)]
        text-[var(--text-main)]
        hover:text-white
        hover:bg-[var(--accent-primary)]
        transition
        active:scale-95
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
