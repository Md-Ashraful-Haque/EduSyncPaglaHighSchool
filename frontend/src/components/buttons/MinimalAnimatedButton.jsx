import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const MinimalAnimatedButton = ({toggleSection, buttonAction}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  const toggleText = (sectionKey) => {
    setIsExpanded(!isExpanded);
    console.log('Toggled section:', sectionKey);
  };

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {toggleSection(buttonAction);toggleText("") }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium !rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 overflow-hidden"
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 1) 50%)`
            : 'white'
        }}
      >
        {/* Mouse follow glow effect */}
        {isHovered && (
          <div 
            className="absolute w-24 h-24 bg-blue-400/20 rounded-full blur-xl transition-all duration-300 pointer-events-none"
            style={{
              left: mousePosition.x - 48,
              top: mousePosition.y - 48,
            }}
          />
        )}
        
        {/* Ripple effect on click */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
        {/* Icon with rotation animation */}
        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown size={18} />
        </div>
        
        {/* Text */}
        <span className="text-sm font-medium">
          {isExpanded ? 'কম দেখুন' : 'বিস্তারিত দেখুন'}
        </span>
      </button>
    </>
  );
};

export default MinimalAnimatedButton;