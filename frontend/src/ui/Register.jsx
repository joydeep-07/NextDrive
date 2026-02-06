import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { AUTH_ENDPOINTS } from "../api/endpoint"; 

const Register = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    // Prepare payload – remove confirmPassword
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
    };

    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Backend sent error (e.g. "Email already exists")
        throw new Error(result.message || "Registration failed");
      }

      // Success
      console.log("Registration successful:", result);
      reset(); // optional: clear form
      alert("Account created! You can now log in.");
      onLogin?.(); // switch to login view if you want
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 md:w-96 flex flex-col"
        noValidate
      >
        <h2 className="font-heading text-4xl font-medium text-[var(--text-main)]">
          Sign <span className="text-[var(--accent-primary)]">Up</span>
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

        {/* Show backend error */}
        {errorMessage && (
          <p className="text-xs text-[var(--error)] text-center mb-4">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center justify-center gap-2">
          {/* First Name */}
          <div>
            <div className="flex items-center gap-2 h-12 pl-6 rounded-full border border-[var(--border-light)]">
              <IoPersonOutline className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="First name"
                className="w-full h-full bg-transparent outline-none text-sm"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters",
                  },
                })}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-[var(--error)] mt-1 pl-6">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <div className="flex items-center gap-2 h-12 pl-6 rounded-full border border-[var(--border-light)]">
              <IoPersonOutline className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Last name"
                className="w-full h-full bg-transparent outline-none text-sm"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters",
                  },
                })}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-[var(--error)] mt-1 pl-6">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 h-12 pl-6 rounded-full mt-4 border border-[var(--border-light)]">
          <IoMailOutline className="text-[var(--text-muted)]" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full h-full bg-transparent outline-none text-sm"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-[var(--error)] mt-1 pl-6">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-6 border border-[var(--border-light)]">
          <IoLockClosedOutline className="text-[var(--text-muted)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none text-sm"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-[var(--error)] mt-1 pl-6">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-4 border border-[var(--border-light)]">
          <IoLockClosedOutline className="text-[var(--text-muted)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full h-full bg-transparent outline-none text-sm"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-[var(--error)] mt-1 pl-6">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`
            mt-8 h-11 rounded-full
            bg-[var(--blue-button)]
            text-white font-medium
            transition
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
          `}
        >
          {loading ? "Creating..." : "Create account"}
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
