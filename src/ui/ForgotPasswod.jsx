import { useState, useEffect, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

const ForgotPassword = ({ onBack }) => {
  const [stage, setStage] = useState("email"); // "email" | "otp" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const inputsRef = useRef([]);

  // OTP auto-focus & paste
  useEffect(() => {
    if (stage !== "otp") return;

    const inputs = inputsRef.current;

    inputs.forEach((input, index) => {
      input.oninput = (e) => {
        if (e.inputType === "insertText" && e.target.value && index < 5) {
          inputs[index + 1].focus();
        }
      };

      input.onkeydown = (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
          inputs[index - 1].focus();
        }
      };

      input.onpaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(data)) {
          setOtp(data.split(""));
          inputs[5].focus();
        }
      };
    });
  }, [stage]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: API call to send OTP
    console.log("Sending OTP to:", email);
    setStage("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;
    // TODO: API call to verify OTP
    console.log("Verifying OTP:", code);
    // On success:
    setStage("reset");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    // TODO: API call to reset password
    console.log(
      "Resetting password for:",
      email,
      "with new pass:",
      newPassword,
    );
    // On success → maybe redirect or show success message
    alert("Password reset successful! You can now log in.");
    onBack?.();
  };

  return (
    <div className="w-full flex items-start pt-20 justify-center">
      <form
        className="w-80 md:w-96 flex flex-col"
        onSubmit={
          stage === "email"
            ? handleSendOtp
            : stage === "otp"
              ? handleVerifyOtp
              : handleResetPassword
        }
      >
        <h2 className="text-4xl font-heading font-medium text-[var(--text-main)]/95">
          {stage === "email"
            ? "Reset Password"
            : stage === "otp"
              ? "Verify OTP"
              : "Set New Password"}
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-3">
          {stage === "email"
            ? "Enter your email to receive a one-time password"
            : stage === "otp"
              ? "Enter the 6-digit code sent to your email"
              : "Choose a strong new password"}
        </p>

        {/* ────────────────────────────────────────────── */}
        {/* EMAIL STAGE */}
        {/* ────────────────────────────────────────────── */}
        {stage === "email" && (
          <>
            <div className="flex items-center gap-2 h-12 pl-6 rounded-full mt-8 border border-[var(--border-light)] bg-transparent">
              <IoMailOutline className="text-[var(--text-muted)]" />
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-sm text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-8 h-11 rounded-full bg-[var(--blue-button)] text-white font-medium transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* ────────────────────────────────────────────── */}
        {/* OTP STAGE */}
        {/* ────────────────────────────────────────────── */}
        {stage === "otp" && (
          <>
            <div className="flex items-center justify-between gap-3 mt-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value.replace(/\D/g, "");
                    setOtp(newOtp);
                  }}
                  className="
                    w-12 h-12 text-center text-xl font-medium
                    border border-[var(--border-light)]
                    rounded-xl bg-transparent
                    focus:border-[var(--accent-primary)]
                    outline-none transition
                  "
                />
              ))}
            </div>

            <button
              type="submit"
              className="mt-8 h-11 rounded-full bg-[var(--blue-button)] text-white font-medium transition"
            >
              Verify OTP
            </button>

            <p className="text-sm text-center mt-5 text-[var(--text-muted)]">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={() => setStage("email")}
                className="text-[var(--accent-primary)] hover:underline"
              >
                Resend
              </button>
            </p>
          </>
        )}

        {/* ────────────────────────────────────────────── */}
        {/* RESET PASSWORD STAGE */}
        {/* ────────────────────────────────────────────── */}
        {stage === "reset" && (
          <>
            {/* New Password */}
            <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-8 border border-[var(--border-light)]">
              <IoLockClosedOutline className="text-[var(--text-muted)]" />
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-sm text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
              >
                {showConfirmPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center gap-2 h-12 pl-6 pr-4 rounded-full mt-5 border border-[var(--border-light)]">
              <IoLockClosedOutline className="text-[var(--text-muted)]" />
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-sm text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
              >
                {showConfirmPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            <button
              type="submit"
              className="mt-8 h-11 rounded-full bg-[var(--blue-button)] text-white font-medium transition"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back link */}
        <p className="text-sm text-center mt-4">
          Remember Your Password !{" "}
          <button onClick={onBack} className="text-[var(--accent-primary)]">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
