import { BsPass } from "react-icons/bs";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { PiPassword } from "react-icons/pi";

export default function Login() {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center h-[700px] w-7xl">
          <div className="w-full hidden md:flex justify-center items-center">
            <img
              className="h-[70vh] "
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
              alt="leftSideImage"
            />
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <form className="md:w-96 w-80 flex flex-col items-center justify-center">
              <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
              <p className="text-sm text-gray-500/90 mt-3">
                Welcome back! Please sign in to continue
              </p>

              <button
                type="button"
                className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
              >
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                  alt="googleLogo"
                />
              </button>

              <div className="flex items-center gap-4 w-full my-5">
                <div className="w-full h-px bg-gray-300/90"></div>
                <p className="w-full text-nowrap text-sm text-gray-500/90">
                  or sign in with email
                </p>
                <div className="w-full h-px bg-gray-300/90"></div>
              </div>

              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <IoMailOutline />
                <input
                  type="email"
                  placeholder="Email id"
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <IoLockClosedOutline />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                <div className="flex items-center gap-2">
                  <input className="h-5" type="checkbox" id="checkbox" />
                  <label className="text-sm" htmlFor="checkbox">
                    Remember me
                  </label>
                </div>
                <a className="text-sm underline" href="#">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
              >
                Login
              </button>
              <p className="text-gray-500/90 text-sm mt-4">
                Don’t have an account?{" "}
                <a className="text-indigo-400 hover:underline" href="#">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
