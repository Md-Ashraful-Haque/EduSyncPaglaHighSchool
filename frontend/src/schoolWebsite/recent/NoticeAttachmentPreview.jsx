import PropTypes from 'prop-types';

// ✅ Helper: Check for image files
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  return filename && imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// ✅ Helper: Check for PDF files
function isPDFFile(filename) {
  return filename && filename.toLowerCase().endsWith('.pdf');
}

// ✅ Main Component
const NoticeAttachmentPreview = ({ attachment }) => {
  if (!attachment) return null;

  // ✅ Image Preview
  if (isImageFile(attachment)) {
    return (
      <div className="mt-4 notice-details-image">
        <img
          src={attachment}
          alt="Notice Attachment"
          className="max-w-full h-auto rounded shadow"
        />
      </div>
    );
  }

  // ✅ PDF Preview
  if (isPDFFile(attachment)) {
    return (
      <div className="mt-4 mb-4 notice-details-pdf">
        <embed
          src={attachment}
          type="application/pdf"
          width="100%"
          height="500px"
          className="rounded border shadow"
        />
      </div>
    );
  }

  // ✅ Other File Types – download link
  return (
    <div className="mt-4">
      <a
        href={attachment}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        ডকুমেন্ট ডাউনলোড করুন
      </a>
    </div>
  );
};

NoticeAttachmentPreview.propTypes = {
  attachment: PropTypes.string,
};

export default NoticeAttachmentPreview;
