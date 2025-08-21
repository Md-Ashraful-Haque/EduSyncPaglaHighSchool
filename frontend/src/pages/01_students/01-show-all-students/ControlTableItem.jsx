import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 !rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="text-sm font-medium text-gray-700">{value}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((num) => (
            <div
              key={num}
              onClick={() => handleSelect(num)}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
            >
              {num}
            </div>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomSelect;

// Usage in your component:
// const TableControls = () => {
//   const [itemPerPage, setItemPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="flex items-center gap-4 mb-4">
//       <CustomSelect
//         value={itemPerPage}
//         onChange={(e) => setItemPerPage(e.target.value)}
//         options={[10, 20, 30, 40, 50, 60, 70, 100, 110, 120, 200]}
//         className="w-24"
//       />
//       <span className="text-sm text-gray-600">Students</span>
//       <input
//         type="text"
//         className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="Search"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>
//   );
// };