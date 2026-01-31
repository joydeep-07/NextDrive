import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import AllCollaborators from "../components/AllCollaborators";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../utils/socket";
import { CHAT_ENDPOINTS } from "../api/endpoint";

const GroupChat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const wrapperRef = useRef(null);
  const { folderId } = useParams();
  const token = localStorage.getItem("token");

  let currentUserId = null;
  try {
    currentUserId = JSON.parse(atob(token.split(".")[1])).id;
  } catch {}

  /* =========================
     Fetch old messages
  ========================= */
  useEffect(() => {
    if (!showPopup) return;

    axios
      .get(CHAT_ENDPOINTS.GET_MESSAGES(folderId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setUnreadCount(0); // reset badge on open
      })
      .catch(() => setShowPopup(false));
  }, [showPopup, folderId]);

  /* =========================
     Socket setup (ALWAYS CONNECTED)
  ========================= */
  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.emit("join-folder", folderId);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      // 👇 only count unread if popup closed & not own message
      if (!showPopup && msg.sender._id !== currentUserId) {
        setUnreadCount((c) => c + 1);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [folderId, showPopup]);

  /* =========================
     Send message
  ========================= */
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      folderId,
      message: text,
    });

    setText("");
  };

  /* =========================
     Outside click close
  ========================= */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-40 inline-block">
      {/* CHAT TRIGGER */}
      <div className="relative">
        <img
          className="h-15 w-15 rounded-full cursor-pointer"
          src="https://i.pinimg.com/1200x/6c/2d/b4/6c2db475513ab92f1b96666ec420e84c.jpg"
          alt="Group"
          onClick={() => {
            setShowPopup((p) => !p);
            setUnreadCount(0);
          }}
        />

        {/* 🔴 UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {showPopup && (
        <div className="absolute bottom-full right-4 mb-4 z-50">
          <div className="bg-[var(--bg-secondary)] w-80 sm:w-96 h-[70vh] flex flex-col rounded-2xl border">
            {/* Header */}
            <div className="flex justify-between px-4 py-3 border-b">
              <div className="flex gap-3">
                <FiMessageCircle size={20} />
                <div>
                  <h2 className="text-sm font-semibold">Group Chat</h2>
                  <p className="text-xs">Live discussion</p>
                </div>
              </div>
              <AllCollaborators folderId={folderId} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`max-w-[80%] px-3 py-2 rounded-xl ${
                    m.sender._id === currentUserId
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-[var(--bg-main)]"
                  }`}
                >
                  <span className="block text-xs opacity-70">
                    {m.sender.firstName}
                    {m.sender.role === "admin" && " (Admin)"}
                  </span>
                  {m.message}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent outline-none"
                />
                <button onClick={sendMessage}>
                  <FiSend />
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
