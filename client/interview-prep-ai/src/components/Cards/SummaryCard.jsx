import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      {/* Top colored section */}
      <div
        className="relative rounded-t-xl p-4 flex items-start"
        style={{ background: colors.bgcolor }}
      >
        {/* Initials Circle */}
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center mr-4">
          <span className="text-lg font-semibold text-black">
            {getInitials(role)}
          </span>
        </div>

        {/* Title & Topics */}
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-black">{role}</h2>
          <p className="text-sm text-gray-800 mt-1 line-clamp-1">
            {topicsToFocus}
          </p>
        </div>

        {/* Delete Button */}
        <button
          className="absolute top-3 right-3 flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded border border-rose-200 hover:border-rose-300 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 size={14} />
          Delete
        </button>
      </div>

      {/* Bottom Details */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            Experience: {experience} {experience === 1 ? "Year" : "Years"}
          </div>
          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            {questions} Q&A
          </div>
          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            Last Updated: {lastUpdated}
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
