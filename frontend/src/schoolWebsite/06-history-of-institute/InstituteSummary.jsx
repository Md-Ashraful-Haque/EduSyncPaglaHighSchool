import React from 'react';
import { Calendar, Users, BookOpen, MapPin } from 'lucide-react';

const InstituteSummary = ({school,instituteInfo}) => { 
  return (
   <div className="bg-white shadow-lg border-t-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="text-blue-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">প্রতিষ্ঠিত</span>
              <span className="text-gray-600">{school.established_year}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-green-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষার্থী</span>
              <span className="text-gray-600">{school.total_students}</span>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="text-purple-500 mb-2" size={24} />
              <span className="font-semibold text-gray-900">শিক্ষক</span>
              <span className="text-gray-600">{school.total_teachers}</span>
            </div>
            <div className="flex flex-col items-center col-span-1 md:col-span-2">
              
              <MapPin className="text-red-500 mb-2" size={24} /> 
              <span className="font-semibold text-gray-900">অবস্থান</span>
              <span className="text-gray-600  max-w-full" title={instituteInfo?.address}>
                {instituteInfo?.address}
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default InstituteSummary;