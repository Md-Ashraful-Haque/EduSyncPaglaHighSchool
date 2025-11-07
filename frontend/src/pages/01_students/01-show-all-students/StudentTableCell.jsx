import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import manPlaceHolderImage from '../../../assets/images/avatar-1.png'
const StudentTableCell = ({ student }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <td className="px-2 py-3 border-bottom">
        <div className="flex items-center space-x-3">
          {/* {(() => {
            console.log("student:", student);
            return null;
          })()} */}
          <img
            src={student.picture_cropped_url || manPlaceHolderImage}
            alt={`${student.name}'s profile`}
            className="w-10 h-12 rounded-full object-cover shadow-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={openModal}
          />
          <div className="flex flex-col space-y-0.5 w-[200px]">
            <div className="font-small text-base text-sm font-semibold text-gray-900 leading-tight"> 
              {student.name}
            </div>
            {student.name_bangla && (
              <div className="text-sm text-gray-500 font-medium break-words">
                {student.name_bangla}
              </div>
            )}
          </div> 
        </div>
      </td>

      {/* Modal for full-size image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-between max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="close-button floating sm:top-8 sm:right-32 print:hidden z-1000  p-2 border rounded-sm"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={student.picture_cropped_url || manPlaceHolderImage }
              alt={`${student.name}'s full profile`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTableCell; 