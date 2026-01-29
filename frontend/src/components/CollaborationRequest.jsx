import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_ENDPOINTS } from "../api/endpoint";

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
      {/* Trigger Button – placed wherever you need it */}
      <button
        onClick={() => setOpen(true)}
        className="primary_button px-6 py-2.5 text-sm font-medium"
      >
        Invite
      </button>

      {/* Modal / Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="bg-[var(--bg-main)] w-4xl rounded-xl
                       overflow-hidden flex flex-col h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
              <div>
                <h3 className="text-xl font-medium text-[var(--text-main)] font-heading flex items-center gap-3">
                  
                  Invite Collaborators
                </h3>
                <p className="text-xs text-[var(--text-secondary)]/50">
                  Collaborators can access and upload files in the folder.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xl font-medium transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="p-6 pb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-[var(--border-light)]  bg-[var(--bg-secondary)]/20 text-[var(--text-main)]  placeholder-[var(--text-muted)] focus:outline-none  focus:ring-2 focus:ring-[var(--accent-primary)/30] focus:border-[var(--accent-primary)] transition-all duration-200"
              />
            </div>

            {/* User list area */}
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
                                 hover:bg-[var(--bg-tertiary)] hover:shadow-[var(--shadow-sm)] 
                                 hover:scale-[1.01] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] font-medium shrink-0">
                          {user.firstName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-main)] truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-[var(--text-muted)] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <button
                        className="px-5 py-2 text-sm font-medium rounded-lg 
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
          </div>
        </div>
      )}
    </>
  );
};

export default CollaborationRequest;
