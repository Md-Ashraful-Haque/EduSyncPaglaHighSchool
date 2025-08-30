// import React from "react";
import FullScreenModal from "pageComponents/02_full_screen_window";

import {
  CheckCircle,
  Book,
  Home,
  User,
  BookOpen,
  Video,
  Users,
  Car,
  Building,
  BookOpenText,
  UserCheck,
  HandCoins,
  Hash,
  FileCheck,
  Gavel,
  Award,
  Medal,
  Layers,
  Info,
  Bell,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  Folder,
  UsersRound,
  Shirt,
  CalendarRange,
  NotebookPen,
  Ampersand,
  Download,
  UserCog,
  Goal,
  Contact,
  RefreshCcw,
} from "lucide-react";

// import { Info, Bell, GraduationCap, User, CalendarDays, ClipboardCheck, Folder } from "lucide-react";

// const iconMap = {
//   about: Info,           // আমাদের বিষয়ে
//   notice: Bell,          // নোটিশ
//   academic: GraduationCap, // একাডেমিক
//   student: User,         // শিক্ষার্থী
//   routine: CalendarDays, // রুটিন
//   result: ClipboardCheck, // ফলাফল
//   misc: Folder           // বিবিধ
// };

// অভ্যন্তরিন ফলাফল
// একাডেমিক পরীক্ষার ফলাফল
// বোর্ড পরীক্ষার ফলাফল

// এইচ.এস.সি. (সাধারণ)
// স্নাতক (পাস)
// স্নাতক (সম্মান)
// বাউবি
// অভ্যন্তরীণ পরীক্ষা

// প্রতিষ্ঠান পরিচিতি
// ব্যবস্থাপনা কমিটি
// কর্মচারীবৃন্দ
// ফটোগ্যালারী
// ভিডিও গ্যালারী
// প্রতিষ্ঠানে পাঠদানের অনুমতি ও স্বীকৃতি
// শ্রেণিভিত্তিক অনুমোদিত শাখার তথ্য

const iconMap = {
  Book: Book,
  Home: Home,

  Building: Building, // প্রতিষ্ঠান পরিচিতি
  Users: Users, // ব্যবস্থাপনা কমিটি
  UserCheck: UserCheck, // কর্মচারীবৃন্দ
  FileCheck: FileCheck, // অনুমতি ও স্বীকৃতি
  Layers: Layers, // শ্রেণিভিত্তিক তথ্য
  Info: Info, // আমাদের বিষয়ে
  Bell: Bell, // নোটিশ
  GraduationCap: GraduationCap, // একাডেমিক
  User: User, // শিক্ষার্থী
  CalendarDays: CalendarDays, // রুটিন
  ClipboardCheck: ClipboardCheck, // ফলাফল
  Folder: Folder, // বিবিধ
  UsersRound: UsersRound,
  Shirt: Shirt,
  Gavel: Gavel,
  Award: Award,
  HandCoins: HandCoins,
  BookOpenText: BookOpenText,
  CalendarRange: CalendarRange,
  NotebookPen: NotebookPen,
  Ampersand: Ampersand,
  Medal: Medal,
  Download: Download,
  UserCog: UserCog,
  Goal: Goal,
  Contact: Contact,
  RefreshCcw: RefreshCcw,
  Hash: Hash,
};
import React, { useState, useEffect } from "react";
import axios from "axios";
import { componentMap } from "../02-menu/componentMap";
import { useAppContext } from "ContextAPI/AppContext";

const CardItem = ({ card, className }) => {
  const CardIconComponent = iconMap[card.icon] || Hash; // fallback
  // console.log("Card: ", card)





  const {instituteInfo,isAuthenticated } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showContactInfo, setShowContactInfo] = useState(false);

  const [activeSinglePageComponent, setActiveSinglePageComponent] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const [menuItems, setMenuItems] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/menus/`, {
        withCredentials: true,
      })
      .then((res) => {
        setMenuItems(res.data);
        // console.log("res.data Menu: ", res.data);
        // console.log("instituteInfo updated: ", instituteInfo);
      })
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveSinglePageComponent(null);
  };




  return (
    <div
      className={`rounded-lg  border overflow-hidden transform  transition-all duration-300 shadow-sm ${className} bg-gradient-to-br from-white/80 to-gray-100/80`}
    >
      {/* <div className={`rounded-lg  border overflow-hidden transform  transition-all duration-300 shadow-sm ${className} bg-gradient-to-br from-blue-50 to-gray-100`}> */}

      {/* <div className=" ml-24 py-3">
          <div className="flex items-center  border-bottom  !border-blue-300 space-x-4">
            <h4 className="text-xl font-bold !bg-gradient-to-r !from-black !via-blue-400 !to-blue-900 !bg-clip-text !text-transparent flex-1  z-2">
              {card.title}
            </h4>
          </div>
        </div> */}

      <div className="ml-24 py-3">
        <div className="flex items-center space-x-4 relative">
          <div className="absolute bottom-0 left-0 right-0 h-0.25 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400"></div>
          <h4 className="text-xl font-bold bg-gradient-to-r from-black via-blue-400 to-blue-900 bg-clip-text text-transparent flex-1 z-2 pb-2">
            {card.title}
          </h4>
        </div>
      </div>

      {/* Content - Horizontal Layout like original */}
      <div className="p-8 pt-0 h-full ">
        <div className="flex items-start space-x-8">
          {/* Large Icon Section - Left Side */}
          <div className="flex-shrink-0 relative">
            <div className="absolute z-0 -left-18 -top-25 opacity-50 ">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform duration-300">
                <div className="text-white pl-6 pt-3">
                  <CardIconComponent className="w-6 h-6" />
                </div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Features List - Right Side */}
          <div className="flex-1 space-y-2 z-1">
            {card &&
              card.features.map((feature, index) => {
                // dynamically pick icon
                const CardLinkIconComponent = iconMap[feature.icon] || Hash;
                // console.log("feature.is_active: ", feature.is_active, feature.text, feature.is_active == false);
                if (!feature.is_active) {
                  return null;
                }
                // console.warn("feature.link:", feature.link);

                // if (!feature.link || !feature.link.slug) {
                //   console.warn("Missing link for feature:", feature);
                //   return null;
                // }


                // const cleanedSlug = feature.link.slug.replace(/^\//, "");
                // console.log("cleanedSlug: ", cleanedSlug);
                const Component = componentMap[feature.link];

                return Component ? (
                  <a
                    key={index}
                    // href={feature.link}
                    className="flex items-center space-x-3 px-2 !py-3 sm:!py-2 rounded-lg bg-white/70 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:translate-x-2 group cursor-pointer border border-gray-200/50 !no-underline"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSinglePageComponent(() => Component); // save reference safely
                      setIsModalOpen(true);
                      closeMenu();
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="text-white p-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                        <CardLinkIconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    {/* <CardLinkIconComponent className="w-4 h-4" /> */}
                    <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                      {feature.text}
                    </span>
                  </a>
                ) : (
                  <a
                    key={index}
                    // href={feature.link}
                    className="flex items-center space-x-3 px-2 !py-3 sm:!py-2 rounded-lg bg-white/70 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:translate-x-2 group cursor-pointer border border-gray-200/50 !no-underline"
                    href="#" 
                  >
                    <div className="flex-shrink-0">
                      <div className="text-white p-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                        <CardLinkIconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    {/* <CardLinkIconComponent className="w-4 h-4" /> */}
                    <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                      {feature.text}
                    </span>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>

      {/* {showALlNotice && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}> 
          <NoticeBoard/>
        </FullScreenModal>
      )} */}


      {/* =================== Single Page=================== */}
      <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
        {activeSinglePageComponent &&
          React.createElement(activeSinglePageComponent)}
      </FullScreenModal>

    </div>
  );
};

export default CardItem;
