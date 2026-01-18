import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Login() {

      const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-[var(--bg-main)]">
      <div className="flex items-center justify-center h-[700px] w-full max-w-6xl px-4">
        {/* Left Image */}
        <div className="w-full hidden md:flex justify-center items-center">
          <img
            className="h-[70vh]"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
            alt="leftSideImage"
          />
        </div>

        {/* Form */}
        <div className="w-full flex items-center justify-center">
          <form className="w-80 md:w-96 flex flex-col">
            <h2 className="text-4xl font-medium text-[var(--text-main)]">
              Sign in
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mt-3">
              Welcome back! Please sign in to continue
            </p>

            {/* Google Button */}
            <button
              type="button"
              className="
                w-full mt-8 h-12 rounded-full
                flex items-center justify-center
                bg-[var(--bg-secondary)]
                border border-[var(--border-light)]
               
                transition
              "
            >
              <FcGoogle className="text-2xl mr-2" />
              <h1 className="text-sm font-medium">Google</h1>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[var(--border-light)]" />
              <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                or sign in with email
              </p>
              <div className="flex-1 h-px bg-[var(--border-light)]" />
            </div>

            {/* Email */}
            <div
              className="
                flex items-center gap-2
                h-12 pl-6 rounded-full
                border border-[var(--border-light)]
                bg-transparent
              "
            >
              <IoMailOutline className="text-[var(--text-muted)]" />
              <input
                type="email"
                placeholder="Email id"
                className="
                  w-full h-full bg-transparent outline-none
                  text-sm text-[var(--text-secondary)]
                  placeholder-[var(--text-muted)]
                "
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

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between mt-6 text-sm text-[var(--text-muted)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[var(--accent-primary)]"
                />
                Remember me
              </label>

              <a
                href="#"
                className="hover:text-[var(--accent-primary)] underline"
              >
                Forgot password?
              </a>
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
              Login
            </button>

            {/* Signup */}
            <p className="text-sm text-[var(--text-muted)] mt-4 text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[var(--accent-primary)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
