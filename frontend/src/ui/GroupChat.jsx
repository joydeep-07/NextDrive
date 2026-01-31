import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import AllCollaborators from "../components/AllCollaborators";
import { useParams } from "react-router-dom";

const GroupChat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const wrapperRef = useRef(null);
  const { folderId } = useParams();
  /* =========================
     Close on outside click
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     Lock scroll when open
  ========================= */
  useEffect(() => {
    if (!showPopup) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [showPopup]);

  return (
    <div ref={wrapperRef} className="relative z-40 inline-block">
      {/* Trigger */}
      <img
        className="h-15 w-15 rounded-full cursor-pointer transition-transform hover:scale-105"
        src="https://i.pinimg.com/1200x/6c/2d/b4/6c2db475513ab92f1b96666ec420e84c.jpg"
        alt="Group icon"
        onClick={() => setShowPopup((prev) => !prev)}
      />

      {/* Chat Popup */}
      {showPopup && (
        <div className="absolute bottom-full right-4 mb-4 z-50">
          <div
            className="
              bg-[var(--bg-secondary)]
              rounded-2xl
              w-80 sm:w-96
              h-[70vh]
              shadow-2xl
              flex flex-col
              border border-[var(--border-light)]/50
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-light)] gap-3 px-4 py-3 ">
              <div className="flex gap-4">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <FiMessageCircle className="text-blue-600" size={20} />
                </div>
                <div className="">
                  <h2 className="text-sm font-semibold text-[var(--text-main)]">
                    Group Chat
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Team discussion
                  </p>
                </div>
              </div>
              <AllCollaborators folderId={folderId} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {/* Placeholder messages */}
              <div className="self-start max-w-[80%] bg-[var(--bg-main)] px-3 py-2 rounded-xl">
                Hey everyone 👋
              </div>

              <div className="self-start max-w-[80%] bg-[var(--bg-main)] px-3 py-2 rounded-xl">
                Let’s sync on today’s updates.
              </div>

              <div className="self-end max-w-[80%] bg-blue-600 text-white px-3 py-2 rounded-xl">
                Sure, uploading files now 🚀
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--border-light)]/50">
              <div className="flex items-center gap-2 bg-[var(--bg-main)] rounded-xl px-3 py-2">
                <input
                  type="text"
                  placeholder="Type a message…"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                    text-[var(--text-main)]
                    placeholder:text-[var(--text-muted)]
                  "
                />

                <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                  <FiSend className="text-white" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
