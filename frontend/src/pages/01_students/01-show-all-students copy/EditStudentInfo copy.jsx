// export default EditStudentInfo;
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import React, { useState, useEffect } from "react";
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
  const handleSubmit = async () => {
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
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">
            Loading student data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8"> 
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6" />
              <h1 className="text-xl font-semibold">
                Edit Student Information
              </h1>
            </div>
          </div>

          <div className="p-6">
            
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


            <div className="space-y-8">
              {/* Profile + Basic Info */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label className="mt-2 cursor-pointer">
                    <span className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" /> Upload Photo
                    </span>
                    <input
                      type="file"
                      name="picture"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Full Name
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 min-w-0">
                          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Roll Number
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="roll_number"
                          value={formData.roll_number || ""}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your roll number"
                          className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-blue-50/30 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>


              </div>

              {/* Academic Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Academic Information
                  {loadingDropdowns && (
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin text-blue-500" />
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year *
                    </label>
                    <select
                      name="year"
                      value={formData.year || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Year</option>
                      {instituteData.years.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <select
                      name="class_instance"
                      value={formData.class_instance || ""}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.year || loadingDropdowns}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Class</option>
                      {instituteData.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.class_name?.name} ({c.shift})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group *
                    </label>
                    <select
                      name="group"
                      value={formData.group || ""}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.class_instance || loadingDropdowns}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Group</option>
                      {instituteData.groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.group_name?.name} ({g.group_name?.name_bengali})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section *
                    </label>
                    <select
                      name="section"
                      value={formData.section || ""}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.group || loadingDropdowns}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Section</option>
                      {instituteData.sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.section_name?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student ID */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={student.student_id || "Will be generated"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Student ID will be auto-generated based on academic
                      information
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guardian Mobile
                    </label>
                    <input
                      type="tel"
                      name="guardian_mobile_number"
                      value={formData.guardian_mobile_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || loadingDropdowns}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudentInfo;
