import React, { forwardRef } from "react";

const TeacherPrintPage = forwardRef(({ teachers }, ref) => (
  <div ref={ref} className="print:p-10 space-y-12">
    {teachers.map((t) => (
      <div
        key={t.id}
        className="page-break p-6 border rounded-md shadow-lg w-[210mm] mx-auto bg-white"
      >
        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-4">
          {t.picture_url && (
            <img
              src={t.picture_url}
              alt={t.name}
              className="w-32 h-40 object-cover rounded-lg border"
            />
          )}
          <div className="flex flex-col space-y-1">
            <h1 className="text-xl font-bold">{t.name}</h1>
            {t.bangla_name && (
              <h2 className="text-lg font-semibold text-gray-700">
                {t.bangla_name}
              </h2>
            )}
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
              {t.designation_display}
            </span>
          </div>
        </div>

        {/* Contact Section */}
        {(t.phone_number || t.email || t.is_whatsapp) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              📞 Contact Info
            </h3>
            <div className="text-sm space-y-1">
              {t.phone_number && (
                <p>
                  <b>Phone:</b> {t.phone_number} {t.is_whatsapp ? "(WhatsApp)" : ""}
                </p>
              )}
              {t.email && (
                <p>
                  <b>Email:</b> {t.email}
                </p>
              )} 
            </div>
          </div>
        )}

        {/* Personal Info */}
        {(t.blood_group || t.dob || t.religion || t.nid || t.address) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              👤 Personal Info
            </h3>
            <div className="text-sm space-y-1">
              {t.blood_group && (
                <p>
                  <b>Blood Group:</b> {t.blood_group}
                </p>
              )}
              {t.dob && (
                <p>
                  <b>Date of Birth:</b> {t.dob}
                </p>
              )}
              {t.religion && (
                <p>
                  <b>Religion:</b> {t.religion}
                </p>
              )}
              {t.nid && (
                <p>
                  <b>National ID:</b> {t.nid}
                </p>
              )}
              {t.address && (
                <p>
                  <b>Address:</b> {t.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Job Info */}
        {(t.joining_date ||
          t.indexing_of_mpo ||
          t.index_number ||
          t.section) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              💼 Job Info
            </h3>
            <div className="text-sm space-y-1">
              {t.joining_date && (
                <p>
                  <b>Joining Date:</b> {t.joining_date}
                </p>
              )}
              {t.indexing_of_mpo && (
                <p>
                  <b>MPO Indexing Date:</b> {t.indexing_of_mpo}
                </p>
              )}
              {t.index_number && (
                <p>
                  <b>Index Number:</b> {t.index_number}
                </p>
              )}
              {t.section && (
                <p>
                  <b>Section:</b> {t.section}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Qualification */}
        {t.qualification && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              🎓 Qualification
            </h3>
            <p className="text-sm">{t.qualification}</p>
          </div>
        )}

        {/* Signature */}
        {t.signature_url && (
          <div className="mt-6 flex flex-col items-end">
            <img
              src={t.signature_url}
              alt="Signature"
              className="w-40 object-contain mb-1"
            />
            <p className="text-sm text-gray-800">Signature</p>
          </div>
        )}
      </div>
    ))}
  </div>
));

TeacherPrintPage.displayName = "TeacherPrintPage";
export default TeacherPrintPage;
