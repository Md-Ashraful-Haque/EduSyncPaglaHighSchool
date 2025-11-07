// components/DashboardButton.jsx
import React from "react";
// import { cn } from "@/lib/utils"; // optional: className merge helper

export default function DashboardButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white border rounded-xl px-4 py-8 shadow hover:bg-gray-50 transition text-gray-800 text-sm md:text-base"
    >
      <Icon className="w-5 h-5 text-indigo-600" />
      <span>{label}</span>
    </button>
  );
}
// DashboardButton.propTypes = {
//   icon: PropTypes.elementType.isRequired,
//   label: PropTypes.string.isRequired,
//   onClick: PropTypes.func.isRequired,
// };