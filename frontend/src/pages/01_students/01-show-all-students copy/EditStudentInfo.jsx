// export default EditStudentInfo;
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import React, { useState, useEffect } from "react";
import Loading_1 from "LoadingComponent/loading/Loading_1";

import {
  Save,
  Upload,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  BookOpen,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "ContextAPI/AppContext";
import { doGetAPIcall, saveFormData } from "Utils/utilsFunctions/UtilFuntions";
import { toast } from "react-toastify";


const EditStudentInfo = ({ studentId,closeEditStudentData }) => {
  const [student, setStudent] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [instituteData, setInstituteData] = useState({
    years: [],
    classes: [],
    groups: [],
    sections: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();
  const { createNewAccessToken } = useAppContext();

  // Fetch student and all dependent dropdowns
  useEffect(() => {
    if (!studentId) return;
    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch student
        const studentResponse = await doGetAPIcall(
          createNewAccessToken,
          `student-detail-view/${studentId}`,
          bySubjectVars
        );
        setStudent(studentResponse);
        setFormData(studentResponse);
        if (studentResponse.picture) setImagePreview(studentResponse.picture);

        // 2️⃣ Fetch institute years
        const yearsResponse = await doGetAPIcall(
          createNewAccessToken,
          `institute-years/${studentResponse.institute}`,
          { ...bySubjectVars, institute_id: studentResponse.institute }
        );

        // 3️⃣ Fetch classes
        const classesResponse = await doGetAPIcall(
          createNewAccessToken,
          `year-classes/${studentResponse.year}`,
          {
            ...bySubjectVars,
            institute_id: studentResponse.institute,
            year_id: studentResponse.year,
          }
        );

        // 4️⃣ Fetch groups
        const groupsResponse = await doGetAPIcall(
          createNewAccessToken,
          `class-groups/${studentResponse.class_instance}`,
          { ...bySubjectVars, class_id: studentResponse.class_instance }
        );

        // 5️⃣ Fetch sections
        const sectionsResponse = await doGetAPIcall(
          createNewAccessToken,
          `group-sections/${studentResponse.group}`,
          { ...bySubjectVars, group_id: studentResponse.group }
        );

        // Update instituteData
        setInstituteData({
          years: yearsResponse || [],
          classes: classesResponse || [],
          groups: groupsResponse || [],
          sections: sectionsResponse || [],
        });
      } catch (err) {
        setError("Failed to load student data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [studentId]);

  // Dropdown change handlers
  useEffect(() => {
    if (!formData.institute || !formData.year) return;

    const fetchClasses = async () => {
      setLoadingDropdowns(true);
      try {
        const classesResponse = await doGetAPIcall(
          createNewAccessToken,
          `year-classes/${formData.year}`,
          {
            ...bySubjectVars,
            institute_id: formData.institute,
            year_id: formData.year,
          }
        );

        setInstituteData((prev) => ({
          ...prev,
          classes: classesResponse || [],
          groups: [],
          sections: [],
        }));

        if (!classesResponse.find((c) => c.id === formData.class_instance)) {
          setFormData((prev) => ({
            ...prev,
            class_instance: "",
            group: "",
            section: "",
          }));
        }
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchClasses();
  }, [formData.year]);

  useEffect(() => {
    if (!formData.class_instance) return;

    const fetchGroups = async () => {
      setLoadingDropdowns(true);
      try {
        const groupsResponse = await doGetAPIcall(
          createNewAccessToken,
          `class-groups/${formData.class_instance}`,
          { ...bySubjectVars, class_id: formData.class_instance }
        );

        setInstituteData((prev) => ({
          ...prev,
          groups: groupsResponse || [],
          sections: [],
        }));

        if (!groupsResponse.find((g) => g.id === formData.group)) {
          setFormData((prev) => ({ ...prev, group: "", section: "" }));
        }
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchGroups();
  }, [formData.class_instance]);

  useEffect(() => {
    if (!formData.group) return;

    const fetchSections = async () => {
      setLoadingDropdowns(true);
      try {
        const sectionsResponse = await doGetAPIcall(
          createNewAccessToken,
          `group-sections/${formData.group}`,
          { ...bySubjectVars, group_id: formData.group }
        );

        setInstituteData((prev) => ({
          ...prev,
          sections: sectionsResponse || [],
        }));

        if (!sectionsResponse.find((s) => s.id === formData.section)) {
          setFormData((prev) => ({ ...prev, section: "" }));
        }
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchSections();
  }, [formData.group]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      
      const submitData = new FormData(); 
      Object.keys(formData).forEach((key) => {
        let value = formData[key];

        // Convert FK IDs to integers
        if (
          ["institute", "year", "class_instance", "group", "section"].includes(
            key
          ) &&
          value
        ) {
          value = parseInt(value, 10);
        }

        // Only append picture if it's a File (new upload)
        if (key === "picture") {
          if (value instanceof File) {
            submitData.append(key, value);
          }
          // else do nothing, keep existing picture
        } else if (value !== undefined && value !== null) {
          submitData.append(key, value);
        }
      });

      const response = await saveFormData(
        createNewAccessToken,
        `student-detail-view/${studentId}`,
        submitData,
        "PUT"
      );

      if (!response) throw new Error("Failed to update student");
      setStudent(response);
      setSuccess("Student updated successfully!"); 
      // alert("success")
      // closeEditStudentData(studentId);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update student: " + err.message); 
      setTimeout(() => setError(""), 8000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading_1 />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8"> 
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          {/* <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6" />
              <h1 className="text-xl font-semibold">
                Edit Student Information
              </h1>
            </div>
          </div> */}

          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white px-6 py-6 flex items-center justify-between relative overflow-hidden shadow-xl">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm border border-emerald-400/30">
                <GraduationCap className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  শিক্ষার্থীর তথ্য সম্পাদনা করুন
                </h1> 
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl"></div>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-slate-50 shadow-lg ring-1 ring-black/5">
            
            {error && (
              <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-lg text-red-700 z-50 animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-lg text-green-700 z-50 animate-fade-in">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Profile + Basic Info */}
                <div className="flex items-start space-x-6"> 
                  <div className="flex-shrink-0 flex flex-col items-center">
                  {/* Image Container */}
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border-4 border-white ring-1 ring-slate-200/60 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-slate-400 transition-colors duration-200" />
                      )}
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-200">
                        <Upload className="h-5 w-5 text-slate-600" />
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    {imagePreview && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="mt-4 cursor-pointer group/btn">
                    <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:from-slate-100 hover:to-slate-200 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200/50 transition-all duration-200 transform hover:scale-105 active:scale-95">
                      <Upload className="h-4 w-4 mr-2.5 transition-transform duration-200 group-hover/btn:scale-110" />
                      {imagePreview ? 'Change Photo' : 'Upload Photo'}
                    </span>
                    <input
                      type="file"
                      name="picture"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Helper Text */}
                  <p className="mt-2 text-xs text-slate-500 text-center max-w-[140px]">
                    JPG, PNG or GIF up to 5MB
                  </p>
                </div>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* ////////////////// Full Name ///////////////////////////////*/}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              নাম(ইংরেজি)
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="ইংরেজি নাম টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>
                      {/* ////////////////// Full Name ///////////////////////////////*/}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              নাম(বাংলা)
                              {/* <span className="text-red-500 ml-1">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            name="name_bangla"
                            value={formData.name_bangla || ""}
                            onChange={handleInputChange} 
                            placeholder="বাংলা নাম টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>
                      
                      {/* ////////////////// Roll Number /////////////////////////////// */}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              রোল(ইংরেজি)
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            name="roll_number"
                            value={formData.roll_number || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="রোল ইংরেজিতে টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>


                      {/* ////////////////// NID /////////////////////////////// */}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              NID নম্বর
                              {/* <span className="text-red-500 ml-1">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            name="nid"
                            value={formData.nid || ""}
                            onChange={handleInputChange} 
                            placeholder="NID নম্বর টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>
                      
                      {/* ////////////////// Roll Number /////////////////////////////// */}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              পিতার নাম
                              {/* <span className="text-red-500 ml-1">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            name="fathers_name"
                            value={formData.fathers_name || ""}
                            onChange={handleInputChange} 
                            placeholder="পিতার নাম বাংলা টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>
                      
                      {/* ////////////////// Roll Number /////////////////////////////// */}
                      <div className="space-y-1">
                        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              মাতার নাম
                              {/* <span className="text-red-500 ml-1">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            name="mothers_name"
                            value={formData.mothers_name || ""}
                            onChange={handleInputChange} 
                            placeholder="মাতার নাম বাংলা টাইপ করুন"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                          />
                        </div>
                      </div>


                      


                    </div>


                </div>

                {/* Academic Info */}
                {/* Academic Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" /> একাডেমিক তথ্য
                    {loadingDropdowns && (
                      <RefreshCw className="h-4 w-4 ml-2 animate-spin text-blue-500" />
                    )}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Year */}
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Year
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <select
                          name="year"
                          value={formData.year || ""}
                          onChange={handleInputChange}
                          required
                          className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200 appearance-none cursor-pointer"
                        >
                          <option value="">Select Year</option>
                          {instituteData.years.map((y) => (
                            <option key={y.id} value={y.id}>
                              {y.year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Class */}
                    <div className="space-y-1">
                      <div className={`flex shadow-sm rounded-lg overflow-hidden border border-gray-200 transition-colors duration-200 ${
                        !formData.year || loadingDropdowns 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-gray-300'
                      }`}>
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Class
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <select
                          name="class_instance"
                          value={formData.class_instance || ""}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.year || loadingDropdowns}
                          className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Class</option>
                          {instituteData.classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.class_name?.name} ({c.shift})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Group */}
                    <div className="space-y-1">
                      <div className={`flex shadow-sm rounded-lg overflow-hidden border border-gray-200 transition-colors duration-200 ${
                        !formData.class_instance || loadingDropdowns 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-gray-300'
                      }`}>
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Group
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <select
                          name="group"
                          value={formData.group || ""}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.class_instance || loadingDropdowns}
                          className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Group</option>
                          {instituteData.groups.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.group_name?.name} ({g.group_name?.name_bengali})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Section */}
                    <div className="space-y-1">
                      <div className={`flex shadow-sm rounded-lg overflow-hidden border border-gray-200 transition-colors duration-200 ${
                        !formData.group || loadingDropdowns 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-gray-300'
                      }`}>
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Section
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <select
                          name="section"
                          value={formData.section || ""}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.group || loadingDropdowns}
                          className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Section</option>
                          {instituteData.sections.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.section_name?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Student ID */}
                    <div className="md:col-span-2 space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50/50">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                            Student ID
                          </label>
                        </div>
                        <input
                          type="text"
                          value={student.student_id || "Will be generated"}
                          readOnly
                          className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 ml-2">
                        Student ID will be auto-generated based on academic information
                      </p>
                    </div>
                  </div>
                </div>


                {/* Contact Info */}
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2" /> যোগাযোগের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Phone Number */}
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            মোবাইল নম্বর
                          </label>
                        </div>
                        <input
                          type="tel"
                          name="phone_number"
                          required
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          placeholder="মোবাইল নম্বর টাইপ করুন "
                          className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>


                    {/* Email */}
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            ই-মেইল
                          </label>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ই-মেইল এড্রেস টাইপ করুন(যদি থাকে)"
                          className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            জন্ম তারিখ
                          </label>
                        </div>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob || ""}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>


                    {/* Guardian Mobile */}
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            অভিভাবকের মোবাইল নম্বর
                          </label>
                        </div>
                        <input
                          type="tel"
                          name="guardian_mobile_number"
                          value={formData.guardian_mobile_number || ""}
                          onChange={handleInputChange}
                          placeholder="অভিভাবকের মোবাইল নম্বর টাইপ করুন"
                          className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    
                  </div>

                  {/* Address */}
                  <div className="mt-6 space-y-1">
                    <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                      <div className="flex items-start px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-[90px]">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap pt-0.5">
                          যোগাযোগের ঠিকানা
                        </label>
                      </div>
                      <textarea
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="যোগাযোগের ঠিকানা টাইপ করুন"
                        className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */} 
                <div className="flex items-center justify-center space-x-4 pt-8 border-t border-gray-200">
                  <button
                    // type="button"
                    type="submit"
                    // onClick={handleSubmit}
                    disabled={saving || loadingDropdowns}
                    className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out min-w-[160px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative flex items-center space-x-2.5">
                      {saving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      ) : (
                        <Save className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      )}
                      <span className="text-sm font-medium tracking-wide">
                        {saving ? "Saving Changes..." : "Update Student"}
                      </span>
                    </div>
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-150 ease-out rounded-full"></div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudentInfo;
