import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const AcceptRequest = () => {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    axios
      .get(FOLDER_ENDPOINTS.GET_INVITATIONS, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInvites(res.data.invitations))
      .catch(console.error);
  }, [open, token]);

  const acceptInvite = async (folderId) => {
    await axios.post(
      FOLDER_ENDPOINTS.ACCEPT_INVITE,
      { folderId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setInvites((prev) => prev.filter((f) => f._id !== folderId));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[var(--bg-secondary)] p-2 rounded-full"
      >
        <FaBell />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-1/2 left-1/2 z-50 bg-[var(--bg-main)]
                w-96 rounded-xl p-5 border"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <h2 className="mb-4 font-semibold">Invitations</h2>

              {invites.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  No invitations
                </p>
              ) : (
                invites.map((folder) => (
                  <div
                    key={folder._id}
                    className="flex justify-between items-center mb-3"
                  >
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        by {folder.owner.firstName}
                      </p>
                    </div>

                    <button
                      onClick={() => acceptInvite(folder._id)}
                      className="primary_button px-4 py-1 text-sm"
                    >
                      Accept
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AcceptRequest;
