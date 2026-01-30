import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AcceptRequest = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-[var(--bg-secondary)] p-2 rounded-full"
      >
        <FaBell className="text-lg" />
      </button>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-50
                         bg-[var(--bg-main)] rounded-xl p-6 w-4xl h-[70vh] border border-[var(--border-light)]/20 shadow-xl"
              initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-lg font-heading font-semibold mb-2">
                Collaboration <span className="text-[var(--accent-primary)] ">Requests</span>
              </h2>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AcceptRequest;
