
import { XMarkIcon } from '@heroicons/react/24/solid';

const FullScreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // <div className=" z-1000 fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center sm:p-4 font-hind-siliguri modal-overlay z-50 top-0 left-0 right-0 bottom-0">
    <div className=" z-1000 fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center  font-hind-siliguri modal-overlay z-50 top-0 left-0 right-0 bottom-0">
      <div className="relative w-full h-full bg-white  overflow-auto modal-content">
        <button
          onClick={onClose}
          className="close-button floating sm:top-8 sm:right-32 print:hidden z-1000  p-2 border rounded-sm"
          // className="close-button floating fixed top-2 right-3 sm:top-8 sm:right-10 print:hidden z-1000  p-2 border rounded-sm"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" /> {/* Fixed w-4 to w-6 */}
        </button>
        

        <div className="result-list-container">

          {children}

        </div>
        
      </div>
    </div>
  );
};

export default FullScreenModal;