import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

const Login = ({ onRegister, onForgot }) => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data) => {
    dispatch(
      loginUser({
        email: data.email.trim(),
        password: data.password,
      }),
    );
  };

  /* Optional: clear form on successful login */
  useEffect(() => {
    if (isAuthenticated) {
      reset();
    }
  }, [isAuthenticated, reset]);

  return (
    <div>
      <div className="w-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-80 md:w-96 flex flex-col"
          noValidate
        >
          <h2 className="font-heading text-4xl font-medium text-[var(--text-main)]">
            Sign <span className="text-[var(--accent-primary)]">In</span>
          </h2>

          <p className="text-sm text-[var(--text-secondary)] mt-3">
            Welcome back! Please sign in to continue
          </p>

          {/* Google Button (UI only for now) */}
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

          {/* Backend / Auth Error */}
          {error && (
            <p className="text-xs text-[var(--error)] text-center mb-4">
              {error}
            </p>
          )}

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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
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

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between mt-6 text-sm text-[var(--text-muted)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-[var(--accent-primary)]"
                {...register("rememberMe")}
              />
              Remember me
            </label>

            {/* Enable later */}
            {/* <button
              type="button"
              onClick={onForgot}
              className="text-sm underline"
            >
              Forgot password?
            </button> */}
          </div>

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
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Signup */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onRegister}
              className="text-[var(--accent-primary)]"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
