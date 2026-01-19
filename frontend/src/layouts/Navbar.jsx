import React, { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

          <Link to="/auth" className="primary_button">Sign Up</Link>

         
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
              <a
                href="/"
                onClick={() => setOpen(false)}
                className="hover:text-[var(--accent-primary)] transition"
              >
                Home
              </a>

              <ThemeToggle />

              <a
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-center px-5 py-2 rounded-full text-white transition active:scale-95"
                style={{
                  backgroundColor: "var(--accent-primary)",
                }}
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
