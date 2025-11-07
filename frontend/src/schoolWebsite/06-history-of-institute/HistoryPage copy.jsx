import {
  MapPin,
  Phone,
  Mail,
  Users,
  BookOpen,
  Calendar,
  Award,
  Clock,
} from "lucide-react";
import * as Icons from "lucide-react";
import HistoryContentSection from "./HistoryContentSection";
import schoolLogo from "../../assets/images/penchulTransWhite.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../../ContextAPI/AppContext";

import InstituteSummary from "./InstituteSummaryMordern";
import ImageModal from "Components/full_screen_modal/ImageModal.jsx";
// import InstituteSummary from './InstituteSummary'

const HistoryPage = () => {
  // const [expandedSections, setExpandedSections] = useState({});
  const { instituteInfo } = useAppContext();
  // Sample school data - replace with your actual data

  const [school, setSchool] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteCode = import.meta.env.VITE_INSTITUTE_CODE;

  useEffect(() => {
    axios
      .get(`${apiUrl}/institute-details/${instituteCode}/public/`, {
        withCredentials: true,
      })
      .then((res) => {
        setSchool(res.data);
        // console.log("instituteInfo: ", res.data);
      })
      .catch((err) => console.error("Institute fetch error:", err));
  }, []);

  if (!school) return <p>Loading...</p>;
  return (
    <div className="min-h-screen mt-8 2xl:max-w-[1280px] 2xl:min-w-[1280px]">
      {/* Hero Section */}
      <div className="relative lg:!max-w-6xl 2xl:max-w-[1280px] 2xl:min-w-[1280px] overflow-hidden">
        {school.heading_background_image_cropped_url && (
          <img
            src={school.heading_background_image_cropped_url}
            alt={instituteInfo?.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 md:p-8">
          <div className="max-w-6xl mx-auto flex justify-center ">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img
                src={instituteInfo?.logo_url}
                // alt={title}
                className=" h-20 w-20 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl md:text-6xl font-bold text-white mb-1 drop-shadow-lg text-center">
              {instituteInfo?.name}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 font-medium drop-shadow text-center">
              {instituteInfo?.name_in_english}
            </p>
          </div>
        </div>
      </div>

      <InstituteSummary school={school} instituteInfo={instituteInfo} />

      {/* Main Content */}
      {/* <div className="max-w-6xl mx-auto px-3 md:px-32 py-12"> */}
      <div className="max-w-6xl 2xl:max-w-full mx-auto  py-8">
        {/* <div className="max-w-6xl mx-auto px-8 py-12"> */}
        {/* Introduction Section */}
        {school.introduction && (
          <HistoryContentSection
            title={school.introduction.title}
            content={school.introduction.content}
            image_url={school.introduction.image_cropped_url}
            // image_url={school.introduction.image_url}
            show_image={school.introduction.show_image}
            sectionKey="introduction"
          />
        )}

        {school.history && (
          <HistoryContentSection
            title={school.history.title}
            content={school.history.content}
            image_url={school.history.image_cropped_url}
            show_image={school.history.show_image}
            sectionKey="introduction"
          />
        )}

        {/* Facilities Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-green-500 pb-2">
              আমাদের সুবিধাসমূহ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {school.facilities &&
                school.facilities.map((facility, index) => {
                  const IconComponent =
                    Icons[facility.icon] || Icons.HelpCircle;

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="bg-blue-100 p-3 rounded-full">
                        <IconComponent className="text-blue-600" size={24} />
                      </div>
                      <div className="flex justify-between  w-full">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {facility.title}
                          </h3>
                          <p className="text-gray-600 p-0 m-0">
                            {facility.description}
                          </p>
                        </div>

                        <div className="max-w-[80px] rounded-xl">
                          {/* <img className="max-w-[80px] rounded-xl" src={facility.image_cropped_url} alt="" /> */}
                          <ImageModal
                            image={facility.image_cropped_url}
                            fullImage={facility.image_url}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-gray-800  to-green-700 rounded-2xl shadow-lg overflow-hidden mb-8 text-white">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-white/30 pb-2">
              আমাদের অর্জনসমূহ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {school.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-4"
                >
                  <Award className="text-yellow-200 flex-shrink-0" size={20} />
                  <span className="font-medium">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden text-white">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-blue-500 pb-2">
              যোগাযোগ করুন
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center space-x-3">
                <div className="flex items-center  space-x-2">
                  <MapPin className="text-blue-400" size={24} />
                  <div className="font-semibold">ঠিকানা</div>
                </div>
                <p className="text-gray-300">{instituteInfo?.address}</p>
              </div>

              <div className="flex flex-col items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Phone className="text-green-400" size={24} />
                  <div className="font-semibold">ফোন</div>
                </div>
                <p className="text-gray-300">{instituteInfo?.mobile_number}</p>
              </div>

              <div className="flex flex-col items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Mail className="text-purple-400" size={24} />
                  <div className="font-semibold">ইমেইল</div>
                </div>
                <p className="text-gray-300">{instituteInfo?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
