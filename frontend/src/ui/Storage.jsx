import React from "react";

const TOTAL_STORAGE_GB = 15;

const Storage = ({ usedGB = 6.3 }) => {
  const percentage = Math.min((usedGB / TOTAL_STORAGE_GB) * 100, 100);

  return (
    <div className="w-64 mb-4">
      {/* Label */}
      <div className="flex justify-between items-end mb-1 text-[var(--text-secondary)] ">
        <span className="text-sm">Storage</span>
        <span className="text-xs">
          {usedGB} GB / {TOTAL_STORAGE_GB} GB
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
        <div
          className="h-full bg-[var(--accent-primary)]/70 rounded-xl transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-xs text-[var(--text-secondary)] mt-1">
        {percentage.toFixed(1)}% used
      </p>
    </div>
  );
};

export default Storage;
