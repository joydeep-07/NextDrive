import React, { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { MdMenu } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import LogoutButton from "../ui/LogoutButton";
import { FaSearch } from "react-icons/fa";
import UserDetail from "../ui/UserDetail";
import AcceptRequest from "../components/AcceptRequest";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    // navigate("/auth");
  };

  return (
    <header className="w-full bg-[var(--bg-main)] border-b border-[var(--border-light)]/40 z-50 fixed top-0">
      <nav
        className="relative flex h-[70px] items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold">
          NEXT
          <span style={{ color: "var(--accent-primary)" }}>CLOUD</span>
        </Link>

        {/* Desktop Right Section */}
        <div className="hidden md:flex w-2xl items-center justify-end gap-6">
          {isAuthenticated && (
            <div>
              <div className="flex items-center border pl-4 gap-2 border-[var(--border-light)]/90 h-10 w-md rounded-full overflow-hidden max-w-md">
                <FaSearch className="text-[var(--text-secondary)]/50 " />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-full outline-none text-[var(--text-main)] bg-transparent placeholder-[var(--text-muted)]/50 text-sm"
                />
              </div>
            </div>
          )}

          {isAuthenticated && <AcceptRequest/>}

          {isAuthenticated && (
            <div>
              <UserDetail />
            </div>
          )}

          {!isAuthenticated && <ThemeToggle />}
          {!isAuthenticated && (
            <Link to="/auth" className="primary_button">
              Sign In
            </Link>
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

              {!isAuthenticated && <ThemeToggle />}

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
                <LogoutButton />
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
