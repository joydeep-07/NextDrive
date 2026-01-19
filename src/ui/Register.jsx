import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const Register = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex items-center justify-center">
      <form className="w-80 md:w-96 flex flex-col">
        <h2 className="text-4xl font-medium text-[var(--text-main)]">
          Sign Up
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-3">
          Please create your account.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border-light)]" />
          <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">
            or sign up with email
          </p>
          <div className="flex-1 h-px bg-[var(--border-light)]" />
        </div>

        {/* First Name */}
        <div className="flex items-center gap-2 h-12 pl-6 rounded-full border border-[var(--border-light)]">
          <IoPersonOutline className="text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="First name"
            className="w-full h-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex items-center gap-2 h-12 pl-6 rounded-full mt-4 border border-[var(--border-light)]">
          <IoPersonOutline className="text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Last name"
            className="w-full h-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 h-12 pl-6 rounded-full mt-4 border border-[var(--border-light)]">
          <IoMailOutline className="text-[var(--text-muted)]" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full h-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-6 border border-[var(--border-light)]">
          <IoLockClosedOutline className="text-[var(--text-muted)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-4 border border-[var(--border-light)]">
          <IoLockClosedOutline className="text-[var(--text-muted)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full h-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
            mt-8 h-11 rounded-full
            bg-[var(--blue-button)]
            text-white font-medium
            transition
          "
        >
          Create account
        </button>

        {/* Login Link */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            className="text-[var(--accent-primary)] hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
