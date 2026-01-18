import React, { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-sm w-full">
      {/* Navbar */}
      <nav
        className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 transition-all"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        {/* Logo */}
        <a href="#">
          <span className="text-lg font-semibold">
            NEXT<span style={{ color: "var(--accent-primary)" }}>CLOUD</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 md:pl-28">
          {["Home", "Services", "Portfolio", "Pricing"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="hover:text-[var(--accent-primary)] transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Button */}
        <ThemeToggle />

        {/* Mobile Menu Button */}
        <button
          aria-label="menu"
          onClick={() => setOpen(!open)}
          className="md:hidden active:scale-90 transition"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
            <path d="M3 7h24M3 15h24M3 23h24" />
          </svg>
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
            <ul className="flex flex-col space-y-4 text-lg">
              {["Home", "Services", "Portfolio", "Pricing"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-[var(--accent-primary)] transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <ThemeToggle />
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
