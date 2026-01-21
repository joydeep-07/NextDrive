import React, { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { MdMenu } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/auth"); 
  };

  return (
    <header className="w-full">
      <nav
        className="relative flex h-[70px] items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold">
          NEXT
          <span style={{ color: "var(--accent-primary)" }}>CLOUD</span>
        </Link>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />

          {!isAuthenticated ? (
            <Link to="/auth" className="primary_button">
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className="primary_button">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="menu"
          onClick={() => setOpen(!open)}
          className="md:hidden active:scale-90 transition"
        >
          <MdMenu />
        </button>

        {/* Mobile Menu */}
        {open && (
          <div
            className="absolute top-[70px] left-0 w-full p-6 md:hidden"
            style={{
              backgroundColor: "var(--bg-main)",
              borderTop: "1px solid var(--border-light)",
            }}
          >
            <div className="flex flex-col gap-5">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="hover:text-[var(--accent-primary)] transition"
              >
                Home
              </Link>

              <ThemeToggle />

              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="text-center px-5 py-2 rounded-full text-white transition active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                  }}
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-center px-5 py-2 rounded-full text-white transition active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
