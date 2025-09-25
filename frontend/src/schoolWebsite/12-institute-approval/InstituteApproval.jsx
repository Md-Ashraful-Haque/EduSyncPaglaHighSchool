import { useEffect, useState } from "react";
import axios from "axios";
import "./institute-approval.scss"; 


import { useAppContext } from "ContextAPI/AppContext";

// const InstituteApproval = () => {


import { Shield, Award, Download, Eye, Calendar, FileText, CheckCircle, ExternalLink, X, ZoomIn } from 'lucide-react';

const InstituteApproval = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approvalInfo, setApprovalInfo] = useState(null);
  const { instituteInfo } = useAppContext();
  const apiUrl = import.meta.env.VITE_API_URL; 

  const instituteCode = import.meta.env.VITE_INSTITUTE_CODE; 
  
    useEffect(() => {
    axios
      .get(`${apiUrl}/approvals/${instituteCode}/`)
      .then((res) => {
        const data = res.data.results || res.data;
        setApprovalInfo(data);
      })
      .catch((err) => {
        console.error(err);
        setApprovalInfo(null); // reset if error
      })
      .finally(() => setLoading(false));
  }, []);

    const englishDate = new Date(approvalInfo?.issue_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const banglaDate = new Date(approvalInfo?.issue_date).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Replace these with your actual certificate details
  const certificateData = {
    title: "সরকারি কর্তৃপক্ষ কর্তৃক অনুমোদনপত্র",
    titleEn: "Approval Letter from Government Authority",
    instituteName: instituteInfo?.name,
    instituteNameEn: instituteInfo?.name_in_english,
    approvalNumber: approvalInfo?.institute.institute_eiin,
    issueDate: banglaDate,
    issueDateEn: englishDate,
    issuingAuthority: approvalInfo?.authority_bn,
    issuingAuthorityEn: approvalInfo?.authority_en,
    certificateImage: approvalInfo?.image_cropped_url, // Replace with your actual image path
    pdfUrl: approvalInfo?.image_url // Replace with your actual PDF path
    // pdfUrl: "/certificates/approval-certificate.pdf" // Replace with your actual PDF path
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // const handleDownload = () => {
  //   // Create a temporary link element
  //   const link = document.createElement('a');
  //   link.href = certificateData.pdfUrl;
  //   link.download = `${certificateData.instituteName}-approval-certificate.pdf`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = () => {
    if (!certificateData?.pdfUrl) {
      alert("No image available to download.");
      return;
    }

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = certificateData.pdfUrl; // ✅ Use image URL
    link.download = `${certificateData.instituteName}-approval-certificate.jpg`; // ✅ Save as image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  


  return loading ? (
    <div className="text-center py-20">⏳ Loading...</div>
  ) : (
    <div className="!w-full bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Shield className="w-12 h-12 text-green-600 mr-3" />
            <Award className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {certificateData.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {certificateData.titleEn}
          </p>

          {approvalInfo && (
            <div className="flex justify-center items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                সরকারি কর্তৃপক্ষ কর্তৃক অনুমোদিত প্রতিষ্ঠান
              </span>
            </div>
          )}
        </div>

        {!approvalInfo ? (
          <div className="text-center py-20 text-red-500 font-medium">
            ❌ অনুমোদনের কোনো তথ্য পাওয়া যায়নি
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certificate Image Section */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    <u>অনুমোদনপত্র</u>
                  </h2>
                  {/* <p className="text-gray-600">Approval Certificate</p> */}
                </div>

                <div className="relative group">
                  <div className="border-4 border-blue-600 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={certificateData.certificateImage}
                      alt="Government Approval Certificate"
                      className={`w-full h-auto transition-opacity duration-300 ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setIsImageLoaded(true)}
                      loading="lazy"
                    />
                    {!isImageLoaded && (
                      <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={openModal}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>বড় করে দেখুন</span>
                      </button>
                      <button
                        onClick={handleDownload}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>ডাউনলোড</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {/* <button
                    onClick={openModal}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>বিস্তারিত দেখুন</span>
                  </button> */}
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>ডাউনলোড করুন</span>
                  </button>
                </div>
              </div>

              {/* Certificate Details Section */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  সার্টিফিকেটের তথ্য
                </h2> */}

                <div className="space-y-6">
                  {/* Institute Name */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-800 ">
                      <u>প্রতিষ্ঠানের নাম</u>
                    </h3>
                    <p className="text-gray-600 font-semibold">
                      {certificateData.instituteName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {certificateData.instituteNameEn}
                    </p>
                  </div>

                  {/* Approval Details */}
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-lg text-gray-800">
                          শিক্ষা প্রতিষ্ঠান সনাক্তকরণ নম্বর
                        </p>
                        <p className="text-gray-600">
                          {certificateData.approvalNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-lg text-gray-800">জারির তারিখ</p>
                        <p className="text-gray-600">
                          {certificateData.issueDate}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {certificateData.issueDateEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-lg text-gray-800">
                          প্রদানকারী কর্তৃপক্ষ
                        </p>
                        <p className="text-gray-600">
                          {certificateData.issuingAuthority}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {certificateData.issuingAuthorityEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">
                        যাচাইকৃত সার্টিফিকেট
                      </h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      এই সার্টিফিকেটটি সরকারি কর্তৃপক্ষ কর্তৃক যাচাইকৃত এবং বৈধ।
                      আরও তথ্যের জন্য শিক্ষা মন্ত্রণালয়ের ওয়েবসাইট দেখুন।
                    </p>

                    {/* <button className="mt-2 text-green-600 hover:text-green-800 flex items-center space-x-1 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span>যাচাই করুন</span>
                    </button>
                    */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Modal for enlarged view */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  {certificateData.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={certificateData.certificateImage}
                  alt="Government Approval Certificate - Full View"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-center p-4 border-t">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>পিডিএফ ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteApproval;