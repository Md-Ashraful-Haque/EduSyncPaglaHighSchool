import React from 'react';
import { Calendar, Users, BookOpen, MapPin } from 'lucide-react';

const InstituteSummary = ({school,instituteInfo}) => { 
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-2xl border border-slate-200/50 border-top-0  overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      
      {/* Top accent border with gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-red-500"></div>
      
      <div className="relative max-w-6xl mx-auto px-2 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:!gap-8 text-center">
          {/* Established */}
          <div className="group flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-blue-200/30 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-blue-50/50">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="font-bold text-slate-800 text-sm mb-1">প্রতিষ্ঠিত</span>
            <span className="text-slate-600 font-semibold  ">{school.established_year}</span>
          </div>

          {/* Students */}
          <div className="group flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-green-200/30 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-green-50/50">
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <Users className="text-white" size={24} />
            </div>
            <span className="font-bold text-slate-800 text-sm mb-1">শিক্ষার্থী</span>
            <span className="text-slate-600 font-semibold  ">{school.total_students}</span>
          </div>

          {/* Teachers */}
          <div className="group flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-purple-200/30 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-purple-50/50">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="font-bold text-slate-800 text-sm mb-1">শিক্ষক</span>
            <span className="text-slate-600 font-semibold  ">{school.total_teachers}</span>
          </div>

          {/* Location - Larger */}
          <div className="group col-span-1 md:col-span-1 flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-red-200/30 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-red-50/50">
            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <MapPin className="text-white" size={24} />
            </div>
            <span className="font-bold text-slate-800 text-sm mb-2">অবস্থান</span>
            <span className="text-slate-600 font-semibold   leading-tight max-w-full " title={instituteInfo?.address}>
              {instituteInfo?.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteSummary;