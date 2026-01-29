import React from "react";

const TOTAL_STORAGE_GB = 15;

const Storage = ({ usedGB = 3 }) => {
  const percentage = Math.min((usedGB / TOTAL_STORAGE_GB) * 100, 100);

  const getProgressColor = (percentage) => {
    if (percentage <= 25) return "bg-green-500";
    if (percentage <= 50) return "bg-yellow-400";
    if (percentage <= 75) return "bg-orange-500";
    return "bg-red-500";
  };


  return (
    <div className="w-64 mb-4">
      {/* Label */}
      <div className="flex justify-between items-end mb-1 text-[var(--text-secondary)] ">
        <span className="text-sm font-medium">Storage</span>
        <span className="text-xs">
          {usedGB} GB / {TOTAL_STORAGE_GB} GB
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
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
