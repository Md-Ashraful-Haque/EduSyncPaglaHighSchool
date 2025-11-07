
import React, { forwardRef } from "react";

const TeacherPrintPage = forwardRef(({ teachers,instituteInfo }, ref) => (
  <div ref={ref} className="print-container-wrapper">
    {teachers.map((t) => (
      <div
        key={t.id}
        className="p-8 max-w-[210mm] w-full mx-auto bg-white print-page print-center"
      >
        {/* Simple Header */}
        {/* <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <div >
            <div className="flex items-start gap-6">
              {t.picture_url && (
                <img
                  src={t.picture_url}
                  alt={t.name}
                  className="w-28 h-36 object-cover border-2 border-gray-300"
                />
              )}
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {t.name}
                </h2>
                {t.bangla_name && (
                  <h4 className="text-lg text-gray-700 mb-3">
                    {t.bangla_name}
                  </h4>
                )}
                <div className="inline-block px-2 py-1  bg-emerald-100 text-emerald-700 text-emerald-900 text-sm font-medium">
                  {t.designation_display}
                </div>
              </div>
            </div>

            <div className="institute-logo">
              <img src="" alt="" />
            </div>


          </div>
        </div> */}
        <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex justify-between items-start">
            {/* Teacher Info */}
            <div className="flex items-start gap-6">
              {t.picture_url && (
                <img
                  src={t.picture_url}
                  alt={t.name} 
                  className="w-28 h-36 object-cover border-2 border-gray-300"
                />
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{t.name}</h2>
                {t.bangla_name && (
                  <h4 className="text-lg text-gray-700 mb-3">{t.institute} {t.bangla_name}</h4>
                )}
                <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {t.designation_display}
                </div>
              </div>
            </div>

            {/* Institute Logo */}
            <div className="institute-logo w-32 h-32">
              <img src={instituteInfo.logo_url} alt="Institute Logo" className="object-contain w-full h-full" />
              
            </div>
          </div>
        </div>


        {/* Content Sections */}
        <div className="space-y-6">
          {/* Contact Information */}
          {(t.phone_number || t.email || t.is_whatsapp) && (
            <div>
              <h6 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                CONTACT INFORMATION
              </h6>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {t.phone_number && (
                  <div className="flex">
                    <span className="text-gray-600 w-24">Phone</span>
                    <span className="text-gray-900 font-medium">
                      : {t.phone_number}
                      {t.is_whatsapp && <span className="text-gray-500 ml-1">(WhatsApp)</span>}
                    </span>
                  </div>
                )}
                {t.email && (
                  <div className="flex">
                    <span className="text-gray-600 w-24">Email</span>
                    <span className="text-gray-900 font-medium">: {t.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Information */}
          {(t.blood_group || t.dob || t.religion || t.nid || t.address) && (
            <div>
              <h6 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                PERSONAL INFORMATION
              </h6>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {t.blood_group && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Blood Group</span>
                    <span className="text-gray-900 font-medium">: {t.blood_group}</span>
                  </div>
                )}
                {t.dob && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Date of Birth</span>
                    <span className="text-gray-900 font-medium">: {t.dob}</span>
                  </div>
                )}
                {t.religion && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Religion</span>
                    <span className="text-gray-900 font-medium">: {t.religion}</span>
                  </div>
                )}
                {t.nid && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">National ID</span>
                    <span className="text-gray-900 font-medium">: {t.nid}</span>
                  </div>
                )}
                {t.address && (
                  <div className="flex col-span-2">
                    <span className="text-gray-600 w-32">Address</span>
                    <span className="text-gray-900 font-medium flex-1">: {t.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Employment Information */}
          {(t.joining_date || t.indexing_of_mpo || t.index_number || t.section) && (
            <div>
              <h6 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                EMPLOYMENT INFORMATION
              </h6>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {t.joining_date && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Joining Date</span>
                    <span className="text-gray-900 font-medium">: {t.joining_date}</span>
                  </div>
                )}
                {t.indexing_of_mpo && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">MPO Indexing</span>
                    <span className="text-gray-900 font-medium">: {t.indexing_of_mpo}</span>
                  </div>
                )}
                {t.index_number && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Index Number</span>
                    <span className="text-gray-900 font-medium">: {t.index_number}</span>
                  </div>
                )}
                {t.section && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Section</span>
                    <span className="text-gray-900 font-medium">: {t.section}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Qualification */}
          {/* {t.qualification && (
            <div>
              <h6 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                QUALIFICATION
              </h6>
              <p className="text-sm text-gray-800 leading-relaxed">{t.qualification}</p>
            </div>
          )} */}

          {/* Educational Background */}
          {t.educations && t.educations.length > 0 && (
            <div>
              <h6 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                EDUCATIONAL BACKGROUND
              </h6>
              <table className="w-full text-xs border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                      Examination
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                      Board/Institute
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                      Group/Subject
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                      Result
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900">
                      Year
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900">
                      Roll
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.educations.map((edu, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-gray-800">
                        {edu.examination_name || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-800">
                        {edu.board_or_institute || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-800">
                        {edu.group_or_subject || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-800">
                        {edu.result || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                        {edu.passing_year || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                        {edu.roll || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">
                        {edu.duration || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
));

TeacherPrintPage.displayName = "TeacherPrintPage";

export default TeacherPrintPage;