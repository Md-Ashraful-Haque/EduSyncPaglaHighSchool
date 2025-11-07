import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
  MessageSquare,
  Loader,
  AlertCircle,
} from "lucide-react";
import ImageModal from "../../components/full_screen_modal/ImageModal";

import avatar from "./../../assets/images/avatar.png";

const ManagingCommitteeListView = () => {
  const [data, setData] = useState({
    active_committees: [],
    inactive_committees: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCommittees, setExpandedCommittees] = useState(new Set());

  useEffect(() => {
    fetchCommitteeData();
  }, []);

  const fetchCommitteeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL;
      const instituteCode = import.meta.env.VITE_INSTITUTE_CODE;
      const url = `${apiUrl}/committees/?institute_code=${instituteCode}`;

      const response = await fetch(url);
      const result = await response.json();
      // console.log("result: =================>  ", result);

      if (response.ok) {
        setData(result);
        // Auto-expand first active committee if exists
        if (result.active_committees && result.active_committees.length > 0) {
          setExpandedCommittees(new Set([result.active_committees[0].id]));
        }
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching committee data:", err);
      setError("Failed to fetch committee data");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (committeeId) => {
    const newExpanded = new Set(expandedCommittees);
    if (newExpanded.has(committeeId)) {
      newExpanded.delete(committeeId);
    } else {
      newExpanded.add(committeeId);
    }
    setExpandedCommittees(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const SocialLinks = ({ member }) => {
    const socialLinks = [
      {
        url: member.social_facebook,
        icon: Facebook,
        color: "text-blue-600 hover:text-blue-800",
        name: "Facebook",
      },
      {
        url: member.social_linkedin,
        icon: Linkedin,
        color: "text-blue-700 hover:text-blue-900",
        name: "LinkedIn",
      },
      {
        url: member.social_twitter,
        icon: Twitter,
        color: "text-sky-500 hover:text-sky-700",
        name: "Twitter",
      },
    ].filter((link) => link.url);

    if (socialLinks.length === 0) return null;

    return (
      <div className="flex gap-2 mt-3">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${link.color}`}
            title={link.name}
          >
            <link.icon size={16} />
          </a>
        ))}
      </div>
    );
  };

  const MemberCard = ({ member }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Member Image */}
          <div className="flex-shrink-0  p-2 ">
            {member.image_cropped_url || member.image_url ? (
              <img
                src={member.image_cropped_url || member.image_url}
                alt={member.name}
                className="w-full h-[385px] sm:h-[275px] object-cover rounded-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <img
                src={avatar}
                alt="No Image"
                className="w-full h-[385px] sm:h-[275px] object-cover rounded-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>

          {/* Member Details */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h4>
                <p className="text-gray-600 mb-1">{member.designation}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {member.title}
                </span>
              </div>
            </div>

            {/* Message */}
            {member.message && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start gap-2">
                  <MessageSquare
                    size={16}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-blue-800 italic p-0 m-0">
                    "{member.message}"
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              {member.mobile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-green-600" />
                  <a
                    href={`tel:${member.mobile}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    {member.mobile}
                  </a>
                </div>
              )}

              {member.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-blue-600" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              )}

              {member.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin
                    size={16}
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  />
                  <span>{member.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <SocialLinks member={member} />
          </div>
        </div>
      </div>
    );
  };

  const CommitteeCard = ({ committee, isActive }) => {
    const isExpanded = expandedCommittees.has(committee.id);
    console.log("committee.image_document_url: ", committee.image_document_url);
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {committee.institute_name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </div> */}
                  {committee.approved_by && (
                    <p className="text-gray-600 mb-2">
                      <strong>অনুমোদনকারী:</strong> {committee.approved_by}
                    </p>
                  )}
                </div>

                {/* Committee Document Image */}
                {/* {(committee.image_document_cropped_url ||
                  committee.image_document_url) && (
                  <div className="ml-4 w-20 h-28 object-cover rounded ">
                    <ImageModal image={committee.image_document_cropped_url} fullImage={committee.image_document_url} altText="Committee Document Image" />
                  </div>
                )} */}
              </div>

              {/* Committee Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {committee.formation_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-600" />
                    <span>
                      <strong>গঠন:</strong>{" "}
                      <span className=" px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {" "}
                        {formatDate(committee.formation_date)}{" "}
                      </span>
                    </span>
                  </div>
                )}
                {committee.expiry_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-red-600" />
                    <span>
                      <strong>মেয়াদ শেষ:</strong>{" "}
                      <span className=" px-2 py-1 rounded-full bg-red-100 text-red-800">
                        {" "}
                        {formatDate(committee.expiry_date)}{" "}
                      </span>
                    </span>
                  </div>
                )}
                {committee.total_members && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} className="text-green-600" />
                    <span>
                      <strong>মোট সদস্য:</strong>{" "}
                      <span className=" px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {" "}
                        {committee.total_members}{" "}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Committee Document Image */}
            {(committee.image_document_cropped_url ||
              committee.image_document_url) && (
              <div className="ml-4 w-20 h-28 object-cover rounded ">
                <ImageModal
                  image={committee.image_document_cropped_url}
                  fullImage={committee.image_document_url}
                  altText="Committee Document Image"
                />
              </div>
            )}
          </div>
          {/* Description */}
          {committee.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-2">
                কমিটির বিবরণ:
              </h5>
              <p className="text-sm text-gray-700">{committee.description}</p>
            </div>
          )}

          {/* Notes */}
          {committee.notes && (
            <div className="mb-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <h5 className="font-semibold text-yellow-800 mb-1">
                  অতিরিক্ত মন্তব্য:
                </h5>
                <p className="text-sm text-yellow-800">{committee.notes}</p>
              </div>
            </div>
          )}

          {/* PDF Document */}
          {committee.pdf_document_url && (
            <div className="mb-4">
              <a
                href={committee.pdf_document_url}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={16} />
                অনুমোদন নথি ডাউনলোড করুন
              </a>
            </div>
          )}

          {/* Members Toggle */}
          {committee.members && committee.members.length > 0 && (
            <>
              <button
                onClick={() => toggleExpanded(committee.id)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 !rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 border border-blue-200"
              >
                <span className="font-semibold text-gray-900">
                  কমিটির সদস্যবৃন্দ ({committee.members.length} জন প্রদর্শিত)
                </span>
                {isExpanded ? (
                  <ChevronUp size={24} className="text-blue-600" />
                ) : (
                  <ChevronDown size={24} className="text-blue-600" />
                )}
              </button>

              {/* Members List */}
              {isExpanded && (
                <div className="mt-6 space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    সদস্যদের বিস্তারিত তথ্য
                  </h4>
                  {committee.members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader size={48} className="text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            তথ্য লোড করা হচ্ছে...
          </h3>
          <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle size={48} className="text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            একটি সমস্যা হয়েছে
          </h3>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchCommitteeData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl md:min-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          ব্যবস্থাপনা কমিটির তালিকা
        </h1>
        <p className="text-lg text-gray-600">
          শিক্ষা প্রতিষ্ঠানের ব্যবস্থাপনা কমিটি ও সদস্যদের বিস্তারিত তথ্য
        </p>
      </div>

      {/* Refresh Button */}
      {/* <div className="mb-6 flex justify-end">
        <button
          onClick={fetchCommitteeData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? "লোড করছে..." : "রিফ্রেশ করুন"}
        </button>
      </div> */}

      {/* Active Committees */}
      {data.active_committees && data.active_committees.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-green-600" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">
              বর্তমান সক্রিয় কমিটি
              {/* ({data.active_committees.length}) */}
            </h2>
          </div>
          <div className="space-y-8">
            {data.active_committees.map((committee) => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                isActive={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Committees */}
      {data.inactive_committees && data.inactive_committees.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="text-gray-600" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">
              পূর্বের কমিটিসমূহ ({data.inactive_committees.length})
            </h2>
          </div>
          <div className="space-y-8">
            {data.inactive_committees.map((committee) => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!data.active_committees || data.active_committees.length === 0) &&
        (!data.inactive_committees ||
          data.inactive_committees.length === 0) && (
          <div className="text-center py-16">
            <Users size={64} className="mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              কোনো কমিটি পাওয়া যায়নি
            </h3>
            <p className="text-lg text-gray-600">
              এই মুহূর্তে কোনো ব্যবস্থাপনা কমিটির তথ্য উপলব্ধ নেই।
            </p>
          </div>
        )}
    </div>
  );
};

export default ManagingCommitteeListView;
