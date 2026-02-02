import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import AllCollaborators from "../components/AllCollaborators";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../utils/socket";
import { CHAT_ENDPOINTS } from "../api/endpoint";

const popupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: 40,
    transformOrigin: "bottom right",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
      duration: 0.35,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 20,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const GroupChat = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const { folderId } = useParams();
  const token = localStorage.getItem("token");

  let currentUserId = null;
  try {
    currentUserId = JSON.parse(atob(token.split(".")[1])).id;
  } catch {}

  // Scroll only when needed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages when opening popup
  useEffect(() => {
    if (!showPopup) return;

    axios
      .get(CHAT_ENDPOINTS.GET_MESSAGES(folderId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setTimeout(scrollToBottom, 100);
      })
      .catch(() => setShowPopup(false));
  }, [showPopup, folderId, token]);

  // Socket logic
  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    socket.emit("join-folder", folderId);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (!showPopup && msg.sender._id !== currentUserId) {
        setUnreadCount((c) => c + 1);
      }

      if (showPopup) {
        setTimeout(scrollToBottom, 60);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [folderId, token, showPopup, currentUserId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      folderId,
      message: text.trim(),
    });

    setText("");
    setTimeout(scrollToBottom, 80);
  };

  // Close popup on outside click
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
    <div ref={wrapperRef} className="relative inline-block z-40">
      {/* Trigger Button */}
      <div className="relative group">
        <img
          className="h-14 w-14 rounded-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105 shadow-md"
          src="https://i.pinimg.com/1200x/6c/2d/b4/6c2db475513ab92f1b96666ec420e84c.jpg"
          alt="Group"
          onClick={() => {
            setShowPopup((prev) => {
              if (!prev) setUnreadCount(0); // reset ONLY when opening
              return !prev;
            });
          }}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="absolute bottom-full right-0 mb-4 w-80 sm:w-96 pointer-events-auto"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-light)] overflow-hidden flex flex-col h-[75vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/40">
                <div className="flex items-center gap-3">
                  <FiMessageCircle
                    className="text-[var(--accent-primary)]"
                    size={22}
                  />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-main)]">
                      Group Chat
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Live • {messages.length} messages
                    </p>
                  </div>
                </div>
                <AllCollaborators folderId={folderId} />
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-main)]/30 scrollbar-hide"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm italic">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isOwn = m.sender._id === currentUserId;
                    return (
                      <div
                        key={m._id || `${m.message}-${m.createdAt}`}
                        className={`flex ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
                            isOwn
                              ? "bg-[var(--accent-primary)]/70 text-white rounded-br-none"
                              : "bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-bl-none border border-[var(--border-light)]/60"
                          }`}
                        >
                          {!isOwn && (
                            <span className="block text-xs font-medium opacity-80 mb-1">
                              {m.sender.firstName}
                            </span>
                          )}
                          <p className="text-sm break-words">{m.message}</p>
                          <span className="block text-xs opacity-60 mt-1 text-right">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-2 bg-[var(--bg-main)] rounded-full px-4 py-2 shadow-inner">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent outline-none text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`p-2 rounded-full ${
                      text.trim()
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-muted)] cursor-not-allowed"
                    }`}
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupChat;
