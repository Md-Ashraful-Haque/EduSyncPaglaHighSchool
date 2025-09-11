
import {   MapPin, Phone, Mail, Users, BookOpen, Calendar, Award, Clock } from 'lucide-react';

import HistoryContentSection from './HistoryContentSection'
import schoolLogo from "../../assets/images/penchulTransWhite.png";
import axios from "axios";
import { useEffect, useState } from "react";
const HistoryPage = () => {
  // const [expandedSections, setExpandedSections] = useState({});
  
  // Sample school data - replace with your actual data

  const [school, setSchool] = useState(null);

  const schoolData = {
    name: "পেঁচুল উচ্চ বিদ্যালয়",
    nameEnglish: "Penchul High School",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
    established: "১৯৮৫",
    location: "ঢাকা, বাংলাদেশ",
    phone: "+৮৮০-২-৯৮৭৬৫৪৩",
    email: "info@bangladeshmodelschool.edu.bd",
    totalStudents: "১,২৫০",
    totalTeachers: "৮৫",
    introduction: {
      title: "আমাদের প্রতিষ্ঠান সম্পর্কে",
      content: "বাংলাদেশ আদর্শ বিদ্যালয় একটি অগ্রগামী শিক্ষা প্রতিষ্ঠান যা ১৯৮৫ সাল থেকে মানসম্পন্ন শিক্ষা প্রদান করে আসছে। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সামগ্রিক বিকাশ নিশ্চিত করা এবং তাদের ভবিষ্যতের জন্য প্রস্তুত করা। আমরা আধুনিক শিক্ষা পদ্ধতি, অভিজ্ঞ শিক্ষক মণ্ডলী এবং উন্নত অবকাঠামোর মাধ্যমে শিক্ষার্থীদের সর্বোচ্চ মানের শিক্ষা প্রদান করি।",
      image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      show_image: true
    },
    history: {
      title: "আমাদের ইতিহাস",
      content: "বাংলাদেশ আদর্শ বিদ্যালয়ের যাত্রা শুরু হয়েছিল ১৯৮৫ সালে মাত্র ৫০ জন শিক্ষার্থী নিয়ে। প্রতিষ্ঠাতা অধ্যক্ষ জনাব মোহাম্মদ আলী সাহেবের দূরদর্শী নেতৃত্বে এই প্রতিষ্ঠান ধীরে ধীরে একটি স্বনামধন্য শিক্ষা প্রতিষ্ঠানে পরিণত হয়েছে। প্রথম দিকে শুধুমাত্র প্রাথমিক শিক্ষা প্রদান করা হলেও পরবর্তীতে মাধ্যমিক এবং উচ্চ মাধ্যমিক স্তর পর্যন্ত সম্প্রসারিত হয়েছে। ১৯৯২ সালে প্রথমবার এসএসসি পরীক্ষায় ১০০% পাসের হার অর্জন করে এই প্রতিষ্ঠান। ২০০৫ সালে আধুনিক কম্পিউটার ল্যাব এবং ২০১০ সালে বিজ্ঞান গবেষণাগার স্থাপিত হয়। আজ পর্যন্ত এই প্রতিষ্ঠান থেকে ৮,০০০+ শিক্ষার্থী স্নাতক হয়ে দেশ ও বিদেশের বিভিন্ন ক্ষেত্রে উল্লেখযোগ্য অবদান রাখছে।",
      image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      show_image: true
    },
    facilities: [
      { icon: BookOpen, title: "আধুনিক লাইব্রেরি", description: "১০,০০০+ বই সহ ডিজিটাল লাইব্রেরি" },
      { icon: Users, title: "বিজ্ঞান গবেষণাগার", description: "পদার্থ, রসায়ন ও জীববিজ্ঞান ল্যাব" },
      { icon: Award, title: "খেলাধুলা কমপ্লেক্স", description: "ইনডোর ও আউটডোর খেলার সুবিধা" },
      { icon: Clock, title: "কম্পিউটার ল্যাব", description: "৫০+ কম্পিউটার সহ আইটি সেন্টার" }
    ],
    achievements: [
      "জাতীয় শিক্ষা পুরস্কার - ২০২০",
      "সেরা বিদ্যালয় পুরস্কার - ২০১৯",
      "পরিবেশ বান্ধব বিদ্যালয় সার্টিফিকেট",
      "ডিজিটাল বাংলাদেশ পুরস্কার - ২০২১"
    ]
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
        // console.log("res.data Menu: ", res.data);
        // console.log("instituteInfo: ", instituteInfo);
      })
      .catch((err) => console.error("Institute fetch error:", err));
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-16">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={schoolData.heroImage}
          alt={schoolData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto flex justify-center "> 
            <div className="rounded-xl overflow-hidden shadow-md">
              <img
                src={schoolLogo}
                // alt={title}
                className=" h-20 w-20 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div> 
          </div>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-1 drop-shadow-lg text-center">
              {schoolData.name}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 font-medium drop-shadow text-center">
              {schoolData.nameEnglish}
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
              <span className="text-gray-600">{schoolData.established}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-green-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষার্থী</span>
              <span className="text-gray-600">{schoolData.totalStudents}</span>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="text-purple-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষক</span>
              <span className="text-gray-600">{schoolData.totalTeachers}</span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="text-red-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">অবস্থান</span>
              <span className="text-gray-600">{schoolData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        
        {/* Introduction Section */}
        <HistoryContentSection
          title={schoolData.introduction.title}
          content={schoolData.introduction.content}
          image_url={schoolData.introduction.image_url}
          show_image={schoolData.introduction.show_image}
          sectionKey="introduction"
        />

        {/* History Section */}
        <HistoryContentSection
          title={schoolData.history.title}
          content={schoolData.history.content}
          image_url={schoolData.history.image_url}
          show_image={schoolData.history.show_image}
          sectionKey="history"
        />

        {/* Facilities Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-green-500 pb-2">
              আমাদের সুবিধাসমূহ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {schoolData.facilities.map((facility, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <facility.icon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{facility.title}</h3>
                    <p className="text-gray-600">{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-lg overflow-hidden mb-8 text-white">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-white/30 pb-2">
              আমাদের অর্জনসমূহ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {schoolData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <Award className="text-yellow-200 flex-shrink-0" size={20} />
                  <span className="font-medium">{achievement}</span>
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
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-400" size={24} />
                <div>
                  <p className="font-semibold">ঠিকানা</p>
                  <p className="text-gray-300">{schoolData.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-400" size={24} />
                <div>
                  <p className="font-semibold">ফোন</p>
                  <p className="text-gray-300">{schoolData.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-purple-400" size={24} />
                <div>
                  <p className="font-semibold">ইমেইল</p>
                  <p className="text-gray-300">{schoolData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;