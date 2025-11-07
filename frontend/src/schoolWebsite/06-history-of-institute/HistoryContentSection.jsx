import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import MinimalAnimatedButton from "Components/buttons/MinimalAnimatedButton.jsx";

const HistoryContentSection = ({
  title,
  content,
  image_url,
  show_image,
  sectionKey,
}) => {
  const [expandedSections, setExpandedSections] = useState({});
  const isExpanded = expandedSections[sectionKey];

  // Split content into paragraphs by <br> or \n
  const paragraphs = content
    .split(/<br>|\n/)
    .filter((para) => para.trim() !== "");

  // Truncation logic: Accumulate paragraphs up to 450 characters
  let charCount = 0;
  let truncatedParagraphs = [];
  const maxChars = 450;

  if (!isExpanded) {
    for (let para of paragraphs) {
      if (charCount + para.length <= maxChars) {
        truncatedParagraphs.push(para);
        charCount += para.length;
      } else {
        // Truncate the last paragraph to fit within maxChars
        const remainingChars = maxChars - charCount;
        if (remainingChars > 0) {
          truncatedParagraphs.push(para.substring(0, remainingChars) + "...");
        }
        break;
      }
    }
  }

  const displayParagraphs = isExpanded ? paragraphs : truncatedParagraphs;
  const shouldTruncate = content.length > maxChars;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 hover:shadow-xl transition-all duration-300">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">
          {title}
        </h2>
        <div className="relative">
          {show_image && image_url && (
            <div className="float-left mr-6 mb-4 w-full md:w-80">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={image_url}
                  alt={title || "History Image"}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) =>
                    console.error("Image failed to load:", image_url)
                  }
                />
              </div>
            </div>
          )}

          <div className="text-gray-700 leading-relaxed text-lg">
            {displayParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {shouldTruncate && (
            <MinimalAnimatedButton
              toggleSection={toggleSection}
              buttonAction={sectionKey}
              isExpanded={isExpanded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryContentSection;
