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
import { useAppContext } from '../../ContextAPI/AppContext';

const HistoryPage = () => {
  // const [expandedSections, setExpandedSections] = useState({});
 const { instituteInfo } = useAppContext();
  // Sample school data - replace with your actual data

  const [school, setSchool] = useState(null);

  const schoolData = {
    name: "পেঁচুল উচ্চ বিদ্যালয়",
    nameEnglish: "Penchul High School",
    heroImage:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
    established: "১৯৯৩",
    location: "পেঁচুল,শেরপুর, বগুড়া, বাংলাদেশ",
    phone: "০১৭২৪৬২১৬২৮",
    email: "penchulhighschool2014@gmail.com",
    totalStudents: "২৪৩",
    totalTeachers: "১২",
    facilities: [
      {
        icon: BookOpen,
        title: "আধুনিক লাইব্রেরি",
        description: "১০০+ বই সহ ডিজিটাল লাইব্রেরি",
      },
      {
        icon: Users,
        title: "বিজ্ঞান গবেষণাগার",
        description: "পদার্থ, রসায়ন ও জীববিজ্ঞান ল্যাব",
      },
      {
        icon: Award,
        title: "খেলাধুলা কমপ্লেক্স",
        description: "ইনডোর ও আউটডোর খেলার সুবিধা",
      },
      {
        icon: Clock,
        title: "কম্পিউটার ল্যাব",
        description: "কম্পিউটার ল্যাবের মাধ্যমে প্রাকটিক্যাল ক্লাস।",
      },
    ],
    achievements: [
      "জাতীয় শিক্ষা পুরস্কার - ২০২০",
      "সেরা বিদ্যালয় পুরস্কার - ২০১৯",
      "পরিবেশ বান্ধব বিদ্যালয় সার্টিফিকেট",
      "ডিজিটাল বাংলাদেশ পুরস্কার - ২০২১",
    ],
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteCode = "PHS";
  // useEffect(() => {
  //   axios.get(`/api/institute/12345/`).then((res) => {
  //     setSchool(res.data);
  //   });
  // }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/institute/${instituteCode}/`, {
        withCredentials: true,
      })
      .then((res) => {
        setSchool(res.data);
        console.log("instituteInfo: ", res.data);
      })
      .catch((err) => console.error("Institute fetch error:", err));
  }, []);

  if (!school) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-16">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={schoolData.heroImage}
          alt={instituteInfo?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
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
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-1 drop-shadow-lg text-center">
              {instituteInfo?.name}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 font-medium drop-shadow text-center">
              {instituteInfo?.name_in_english}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-white shadow-lg border-t-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="text-blue-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">প্রতিষ্ঠিত</span>
              <span className="text-gray-600"> ১৯৭৬ </span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-green-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষার্থী</span>
              <span className="text-gray-600"> ২৭০০+ </span>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="text-purple-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষক</span>
              <span className="text-gray-600"> ৬০+ </span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="text-red-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">অবস্থান</span>
              <span className="text-gray-600">{instituteInfo?.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* <div className="max-w-6xl mx-auto px-3 md:px-32 py-12"> */}
        <div className="max-w-6xl mx-auto px-3 md:px-8 py-12">
      {/* <div className="max-w-6xl mx-auto px-8 py-12"> */}
        {/* Introduction Section */}
        {school.introduction && (
          <HistoryContentSection
            title={school.introduction.title}
            content={school.introduction.content}
            image_url={school.introduction.image_url}
            show_image={school.introduction.show_image}
            sectionKey="introduction"
          />
        )}

        {school.history && (
          <HistoryContentSection
            title={school.history.title}
            content={school.history.content}
            image_url={school.history.image_url}
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
              {school.facilities && school.facilities.map((facility, index) => {
                const IconComponent = Icons[facility.icon] || Icons.HelpCircle;

                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-blue-100 p-3 rounded-full">
                      <IconComponent className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-gray-600">{facility.description}</p>
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
