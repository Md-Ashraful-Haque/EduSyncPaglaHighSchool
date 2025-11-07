import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const paragraphs = content.split(/<br>|\n/).filter((para) => para.trim() !== '');

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

        <div className="flex flex-col lg:flex-row gap-8">
          {show_image && image_url && (
            <div className="lg:w-1/3">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={image_url}
                  alt={title || "History Image"}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => console.error("Image failed to load:", image_url)}
                />
              </div>
            </div>
          )}

          <div className={`${show_image && image_url ? "lg:w-2/3" : "w-full"}`}>
            <div className="text-gray-700 leading-relaxed text-lg mb-6">
              {displayParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {shouldTruncate && (
              <button
                onClick={() => toggleSection(sectionKey)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="mr-2" size={20} />
                    কম দেখুন
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2" size={20} />
                    বিস্তারিত
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryContentSection;