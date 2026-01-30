import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_ENDPOINTS } from "../api/endpoint";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CollaborationRequest = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(USER_ENDPOINTS.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, token]);

  const filteredUsers = users.filter(
    (user) =>
      user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="primary_button px-6 py-2.5 text-sm font-medium"
      >
        Invite
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[var(--bg-main)] w-4xl rounded-xl
                           overflow-hidden flex flex-col h-[70vh]"
                initial={{ opacity: 0, scale: 0.85, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.15 },
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
                  <div>
                    <h3 className="text-xl font-medium text-[var(--text-main)] font-heading flex justify-start items-center gap-2">
                      Invite
                      <span className="text-[var(--accent-primary)]">
                        Collaborators
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]/50">
                      Collaborators can access and upload files in the folder.
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="p-6 pb-4">
                  <div
                    className="w-full flex items-center px-4 rounded-full border border-[var(--border-light)]
                                  bg-[var(--bg-secondary)]/20"
                  >
                    <FaSearch className="text-[var(--text-secondary)]/70" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-3 outline-none bg-transparent ml-3"
                    />
                  </div>
                </div>

                {/* User List */}
                <div className="flex-1 px-6 pb-6 overflow-y-auto min-h-[200px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-40 text-[var(--text-muted)]">
                      <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-3" />
                      Fetching users...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-[var(--text-muted)] gap-2">
                      <p className="text-lg">No users found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="group flex items-center justify-between p-4 rounded-lg
                                     border border-[var(--border-light)] bg-[var(--bg-tertiary)/40]
                                     hover:bg-[var(--bg-secondary)]/30
                                     hover:scale-[1.01] transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10
                                            flex items-center justify-center text-[var(--accent-primary)]"
                            >
                              {user.firstName?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-[var(--text-muted)] truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <button
                            className="px-5 py-2 text-sm font-medium rounded-sm
                                             bg-[var(--blue-button)] text-white
                                             hover:brightness-110 active:scale-95 transition-all"
                          >
                            Invite
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-light)] flex justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    className="secondary_button px-8 py-2.5 text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollaborationRequest;
