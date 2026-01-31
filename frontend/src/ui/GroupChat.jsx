import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";

const GroupChat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const wrapperRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable background scroll when popup is open + prevent layout jump
  useEffect(() => {
    if (showPopup) {
      // Remember current scroll position
      const scrollY = window.scrollY;
      // Calculate scrollbar width to prevent content shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Lock the body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.paddingRight = `${scrollbarWidth}px`; // compensate for scrollbar disappearance

      // Optional: extra safety for some mobile browsers
      document.documentElement.style.overflow = "hidden";

      // Cleanup when popup closes or component unmounts
      return () => {
        // Restore everything
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.paddingRight = "";
        document.documentElement.style.overflow = "";

        // Return to original scroll position (smoothly)
        window.scrollTo({ top: scrollY, behavior: "instant" });
      };
    }
  }, [showPopup]);

  return (
    <div ref={wrapperRef} className="relative z-40 inline-block">
      {/* Trigger Button */}
      <img
        className="h-15 w-15 rounded-full cursor-pointer transition-transform hover:scale-105"
        src="https://i.pinimg.com/1200x/6c/2d/b4/6c2db475513ab92f1b96666ec420e84c.jpg"
        alt="Group icon"
        onClick={() => setShowPopup((prev) => !prev)}
      />

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-full right-4 mb-4 z-50">
          <div
            className="
              bg-[var(--bg-secondary)] 
              rounded-xl p-6 
              w-80 sm:w-96 
              h-[70vh] 
              overflow-y-auto 
              shadow-2xl
              overscroll-y-contain          /* Prevents scroll chaining on mobile */
            "
          >
            <div className="flex items-center gap-3 mb-4">
              <FiMessageCircle className="text-blue-600" size={26} />
              <h2 className="text-lg font-semibold">Group Chat Info</h2>
            </div>

            <p className="text-gray-700 mb-6 text-sm">
              Welcome to the group chat!
              <br />
              Discuss updates, share files, and collaborate in real time.
            </p>

            {/* Demo content - you can replace with real data */}
            <div className="space-y-4 text-sm text-gray-600">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse.
              </p>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa.
              </p>
              {/* Add more paragraphs or actual chat info here */}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                onClick={() => {
                  alert("Opening chat...");
                  setShowPopup(false);
                }}
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
