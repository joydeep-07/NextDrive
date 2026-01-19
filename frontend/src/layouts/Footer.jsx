import { MdMail } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="
        relative overflow-hidden px-6 md:px-16 lg:px-24 xl:px-32 w-full pt-12 pb-8
        bg-[var(--bg-main)] text-[var(--text-muted)]
      "
    >
      {/* Decorative Background SVG */}
      <svg
        className="
          hidden md:block absolute -bottom-24 -left-80 w-full h-full
          pointer-events-none opacity-10
          text-[var(--text-main)]
        "
        viewBox="0 0 68 26"
        fill="none"
      >
        <path
          d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26C12.6684 26 15.2152 24.9512 17.0929 23.0845L21.3319 18.8705L33.6827 6.59239C34.5795 5.70086 35.7958 5.2 37.0641 5.2C39.1874 5.2 40.9876 6.57576 41.6117 8.47953L45.5096 4.60457C43.7314 1.83589 40.6134 0 37.0641 0C34.4085 0 31.8617 1.04871 29.984 2.91543L13.3943 19.4076C12.4974 20.2992 11.2811 20.8 10.0128 20.8C7.37176 20.8 5.23077 18.6716 5.23077 16.0461C5.23077 14.7852 5.73459 13.5761 6.63139 12.6845L12.7596 6.59239C13.6564 5.70086 14.8727 5.2 16.141 5.2C18.2645 5.2 20.0645 6.57582 20.6887 8.47965L24.5866 4.60466C22.8084 1.83595 19.6904 0 16.141 0Z"
          fill="currentColor"
        />
        <path
          d="M34.3188 19.4076C33.422 20.2992 32.2056 20.8 30.9373 20.8C28.8143 20.8 27.0143 19.4246 26.39 17.5211L22.4922 21.396C24.2705 24.1643 27.3883 26 30.9373 26C33.5929 26 36.1397 24.9512 38.0175 23.0845L54.6072 6.59239C55.504 5.70086 56.7203 5.2 57.9886 5.2C60.6297 5.2 62.7707 7.32839 62.7707 9.95393C62.7707 11.2148 62.2669 12.4239 61.37 13.3155L55.2419 19.4076C54.345 20.2992 53.1287 20.8 51.8604 20.8C49.7372 20.8 47.9371 19.4243 47.3129 17.5207L43.4151 21.3957C45.1933 24.1642 48.3112 26 51.8604 26C54.516 26 57.0628 24.9512 58.9405 23.0845L65.0687 16.9924C66.9465 15.1257 68.0014 12.5939 68.0014 9.95393C68.0014 4.45652 63.5186 0 57.9886 0C55.333 0 52.7863 1.04871 50.9085 2.91543L34.3188 19.4076Z"
          fill="currentColor"
        />
      </svg>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        {/* Brand / Logo */}
        <div className="md:col-span-2 lg:col-span-4 text-[var(--text-main)]">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            NEXT
            <span className="text-[var(--accent-primary)]">CLOUD</span>
          </Link>
          <p className="text-sm text-justify mt-4 text-[var(--text-secondary)]/70 max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum eos nisi explicabo, eligendi illo minima assumenda omnis sapiente at quo.
          </p>
        </div>

        {/* Links Section */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-8 lg:gap-12 justify-between">
          {/* Company Links */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4 uppercase text-[var(--text-main)] text-sm">
              Company
            </h3>
            <div className="flex flex-col space-y-3">
              {["About us", "Careers", "Contact us"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-all text-sm duration-200 hover:text-[var(--accent-primary)] hover:translate-x-1 hover:font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex-1">
            <h3 className="font-semibold uppercase mb-4 text-[var(--text-main)] text-sm">
              Social
            </h3>
            <div className="flex flex-col space-y-3">
              {["Instagram", "Facebook", "Github", "Linkedin"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-all text-sm duration-200 hover:text-[var(--accent-primary)] hover:translate-x-1 hover:font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-2 lg:col-span-4">
          <h3 className="font-semibold text-[var(--text-main)] mb-1 text-sm uppercase">
            Subscribe to our newsletter
          </h3>
          <p className="text-xs mb-6 text-[var(--text-muted)]">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center border pl-4 pr-1 gap-3 bg-[var(--bg-secondary)]/50 border-[var(--border-light)] h-12 rounded-full overflow-hidden transition-all duration-300 hover:border-[var(--accent-primary)]/50 focus-within:border-[var(--accent-primary)] focus-within:shadow-[0_0_0_3px_var(--accent-primary)/10]">
              <MdMail className="w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-full outline-none bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
              />
              <button
                type="submit"
                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 font-medium px-5 h-10 rounded-full text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="
          flex flex-col md:flex-row items-center justify-between gap-4
          pt-6 mt-8 border-t border-[var(--border-light)]
          text-[var(--text-muted)] text-sm
        "
      >
        <p className="text-center">
          © 2025{" "}
          <span className="text-[var(--text-main)] font-medium">
           NextCloud
          </span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          {["Privacy Policy", "Terms", "Cookies"].map((item) => (
            <a
              key={item}
              className="hover:text-[var(--accent-primary)] transition-colors duration-200"
              href="/"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
