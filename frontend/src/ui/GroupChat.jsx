import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import AllCollaborators from "../components/AllCollaborators";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CHAT_ENDPOINTS } from "../api/endpoint";

const GroupChat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]); // ✅ always array
  const [text, setText] = useState("");
  const wrapperRef = useRef(null);
  const { folderId } = useParams();

  const token = localStorage.getItem("token");

  /* =========================
     Decode user id safely
  ========================= */
  let currentUserId = null;
  try {
    if (token) {
      currentUserId = JSON.parse(atob(token.split(".")[1])).id;
    }
  } catch (e) {
    console.error("Invalid token");
  }

  /* =========================
     Fetch messages
  ========================= */
  useEffect(() => {
    if (!showPopup) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(CHAT_ENDPOINTS.GET_MESSAGES(folderId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ ALWAYS ARRAY
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Chat access denied or error");
        setMessages([]);
        setShowPopup(false); // 🔒 auto close if no access
      }
    };

    fetchMessages();
  }, [showPopup, folderId, token]);

  /* =========================
     Send message
  ========================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        CHAT_ENDPOINTS.SEND_MESSAGE(folderId),
        { message: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ append message safely
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (error) {
      console.error("Failed to send message");
    }
  };

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
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: scrollY });
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
            <div className="flex items-center justify-between border-b border-[var(--border-light)] gap-3 px-4 py-3">
              <div className="flex gap-4">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <FiMessageCircle className="text-blue-600" size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Group Chat</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Team discussion
                  </p>
                </div>
              </div>
              <AllCollaborators folderId={folderId} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.length === 0 && (
                <p className="text-center text-xs text-[var(--text-muted)]">
                  No messages yet
                </p>
              )}

              {Array.isArray(messages) &&
                messages.map((m) => (
                  <div
                    key={m._id}
                    className={`max-w-[80%] px-3 py-2 rounded-xl ${
                      m.sender?._id === currentUserId
                        ? "ml-auto bg-blue-600 text-white"
                        : "bg-[var(--bg-main)]"
                    }`}
                  >
                    <span className="block text-xs opacity-70 mb-1">
                      {m.sender?.firstName}
                      {m.sender?.role === "admin" && " (Admin)"}
                    </span>
                    {m.message}
                  </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--border-light)]/50">
              <div className="flex items-center gap-2 bg-[var(--bg-main)] rounded-xl px-3 py-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent outline-none text-sm"
                />

                <button
                  onClick={sendMessage}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
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
