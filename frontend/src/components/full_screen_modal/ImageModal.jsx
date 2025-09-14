import React, { useState } from "react";

// Props:
// - image: the image URL
// - name: student's name
// - placeholder: fallback image if `image` is missing
const ImageModal = ({ image, fullImage=null, altText=null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Thumbnail / small profile image */}

      {image && (
        <img
          // className="hover:pointer"
          src={image}
          alt={altText || "Preview image"}
          className="rounded-xl object-cover shadow-between cursor-pointer hover:shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          onClick={openModal}
          title="Click to view full size"
        /> 

      )}

      {/* Modal for full-size image */}
      {(isModalOpen && fullImage) && (
        <div
          className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 "
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-between max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="absolute -top-5 -right-5 text-xl font-bold z-50 py-2 p-3 border !rounded-full bg-white hover:bg-gray-100 "
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={fullImage}
              alt={altText}
              className="w-full h-auto max-h-[80vh] object-contain !rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
