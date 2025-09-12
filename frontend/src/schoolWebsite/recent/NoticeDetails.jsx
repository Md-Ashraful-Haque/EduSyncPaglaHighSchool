import PropTypes from 'prop-types';
import { CalendarDaysIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import NoticeAttachmentPreview from './NoticeAttachmentPreview';


const NoticeDetails = ({ notice, onClose }) => {
  
  return (
    // <div className="p-6 max-w-3xl mx-auto">
    <div className="container p-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-2">{notice.title}</h2>

      <div className="text-sm text-gray-500 flex items-center mb-4">
        <CalendarDaysIcon className="w-5 h-5 mr-1" />
        প্রকাশিত: {new Date(notice.published_at).toLocaleDateString("bn-BD")}
      </div>

      {/* {notice.attachment && (
        <div className="mt-4 notice-details-image">
          <img src={notice.attachment} alt="" />
        </div>
      )} */}

      {notice.attachment && ( 
          <NoticeAttachmentPreview attachment={notice.attachment} /> 
      )}


      <div
        className="text-gray-700 leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />

      {notice.attachment && (
        <div className="mt-4">
          <a
            href={notice.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            <PaperClipIcon className="w-5 h-5 mr-1" />
            সংযুক্তি ডাউনলোড করুন
          </a>
        </div>
      )}

      <div className="mt-6 flex justify-center ">
        <button
          onClick={onClose}
          className="button-1 px-4 py-2 text-sm"
        >
          বন্ধ করুন
        </button>
      </div> 
    </div>
  );
};

NoticeDetails.propTypes = {
  notice: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NoticeDetails;
