import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import LogoutButton from "./LogoutButton";

const UserDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === "dark";

  // Get real user data from auth slice
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Fallback values
  const firstName = user?.firstName || "user";
  const lastName = user?.lastName || "";
  const email = user?.email || "Not available";

  // Build display name: "First Last" or just "First" or "User"
  const displayName =
    [firstName, lastName]
      .filter(Boolean) // remove empty strings
      .join(" ") || "User";

  // Initial for avatar
  const avatarInitial = firstName.charAt(0).toUpperCase() || "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  if (!isAuthenticated) {
    return null; // or show login button
  }

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`
          flex justify-center items-center 
          border border-[var(--border-light)] 
          p-1.5 
          bg-[var(--text-secondary)]/10 
          rounded-full 
          transition-colors duration-200
          hover:bg-[var(--text-secondary)]/20
        `}
        aria-label="User menu"
      >
        <FaUserCircle className="text-[var(--text-secondary)] text-2xl" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`
              absolute right-0 mt-3 w-72 
              bg-[var(--bg-secondary)]/20 
              border border-[var(--border-light)]/50 
              rounded-xl 
              overflow-hidden z-50
              backdrop-blur-sm
            `}
          >
            {/* Header / User info */}
            <div className="px-5 py-4 border-b border-[var(--border-light)]/50">
              <div className="flex items-center gap-3">
                {/* Avatar circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full 
                    bg-[var(--accent-primary)] 
                    flex items-center justify-center 
                    text-white font-medium text-lg
                  `}
                >
                  {avatarInitial}
                </div>

                <div>
                  <p className="font-medium text-[var(--text-main)]">
                    {displayName}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {/* Theme Toggle */}
              <div className="px-5 py-3">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className={`
                    w-full flex items-center justify-between 
                    text-sm text-[var(--text-secondary)] 
                    hover:text-[var(--text-main)] 
                    transition-colors
                  `}
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  <span className="font-medium">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </span>

                  <div
                    className={`
                      relative w-11 h-6 rounded-full 
                      bg-[var(--border-light)] 
                      transition-colors
                      ${isDark ? "bg-[var(--accent-soft)]" : ""}
                    `}
                  >
                    <motion.div
                      className={`
                        absolute top-1 left-1 w-4 h-4 rounded-full 
                        bg-white shadow-sm
                      `}
                      animate={{ x: isDark ? 20 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Logout */}
              <div className="px-2 pb-1">
                <LogoutButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDetail;
