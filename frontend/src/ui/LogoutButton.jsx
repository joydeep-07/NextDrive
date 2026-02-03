import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.removeItem("token"); // remove JWT (if stored)
    navigate("/"); // redirect to home
  };

  return (
    <button
      onClick={handleLogout}
      className="
        px-5 py-2 bg-[var(--error)] w-full rounded
        text-sm font-medium
       
        text-white
        hover:text-white
        
        transition
        active:scale-95
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
