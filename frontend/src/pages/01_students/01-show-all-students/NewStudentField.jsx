import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react';

const NewStudentField = ({insertStudents, setInsertStudents , saveStudents}) => {
  // const [insertStudents, setInsertStudents] = useState([
  //   {
  //     name: "John Doe",
  //     name_bangla: "জন ডো",
  //     roll_number: "101",
  //     nid: "1234567890",
  //     phone_number: "01712345678",
  //     fathers_name: "Father Name",
  //     mothers_name: "Mother Name",
  //     dob: "2000-01-01",
  //     picture: null,
  //     showPassword: false
  //   }
  // ]);
  const [failedToSave, setFailedToSave] = useState([]);
  const [showAllPasswords, setShowAllPasswords] = useState(false);

  const handleStudentChange = (index, field, value) => {
    const updated = [...insertStudents];
    updated[index][field] = value;
    setInsertStudents(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...insertStudents];
    updated[index].picture = file;
    setInsertStudents(updated);
  };

  const handleAdd = () => {
    setInsertStudents([...insertStudents, {
      name: "",
      name_bangla: "",
      roll_number: "",
      nid: "",
      phone_number: "",
      fathers_name: "",
      mothers_name: "",
      dob: "",
      picture: null,
      showPassword: false
    }]);
  };

  const handleRemove = (index) => {
    const updated = insertStudents.filter((_, i) => i !== index);
    setInsertStudents(updated);
  };

  const handleSave = (e) => {
    // alert('Students saved successfully!');
    saveStudents(e);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Student Information</h2>
              <p className="text-purple-100 text-sm">Manage student records ({insertStudents.length} entries)</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAllPasswords((prev) => !prev)}
            className="flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl hover:bg-white/25 transition-all duration-300 border border-white/20"
          >
            {showAllPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {showAllPasswords ? "Hide Passwords" : "Show Passwords"}
            </span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {[
                "নাম(ইংরেজি)",
                "নাম(বাংলা)",
                "রোল(ইংরেজি)", 
                "NID নম্বর",
                "মোবাইল",
                "পিতার নাম",
                "মাতার নাম",
                "জন্ম তারিখ",
                "ছবি",
                "Action"
              ].map((header, index) => (
                <th 
                  key={header} 
                  className="px-6 py-5 text-left text-sm font-bold text-gray-700 whitespace-nowrap tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index % 3 === 0 ? 'bg-blue-500' : 
                      index % 3 === 1 ? 'bg-purple-500' : 'bg-emerald-500'
                    }`}></div>
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {insertStudents.map((student, index) => (
              <tr
                key={index}
                className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${
                  failedToSave.includes(index) 
                    ? "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400" 
                    : ""
                }`}
              >
                {/* Name (English) */}
                <td className="px-6 py-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleStudentChange(index, "name", e.target.value)}
                      required
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-blue-300"
                    />
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </td>

                {/* Name (Bangla) */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.name_bangla}
                    onChange={(e) => handleStudentChange(index, "name_bangla", e.target.value)}
                    placeholder="বাংলা নাম লিখুন"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-purple-300"
                  />
                </td>

                {/* Roll Number */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.roll_number}
                    onChange={(e) => handleStudentChange(index, "roll_number", e.target.value)}
                    required
                    placeholder="Roll number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-emerald-300"
                  />
                </td>

                {/* NID */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.nid}
                    onChange={(e) => handleStudentChange(index, "nid", e.target.value)}
                    placeholder="NID number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-indigo-300"
                  />
                </td>

                {/* Mobile */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.phone_number}
                    onChange={(e) => handleStudentChange(index, "phone_number", e.target.value)}
                    placeholder="01712345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-cyan-300"
                  />
                </td>

                {/* Father's Name */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.fathers_name}
                    onChange={(e) => handleStudentChange(index, "fathers_name", e.target.value)}
                    placeholder="Father's name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-teal-300"
                  />
                </td>

                {/* Mother's Name */}
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={student.mothers_name}
                    onChange={(e) => handleStudentChange(index, "mothers_name", e.target.value)}
                    placeholder="Mother's name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-pink-300"
                  />
                </td>

                {/* Date of Birth */}
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={student.dob}
                    onChange={(e) => handleStudentChange(index, "dob", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-violet-300"
                  />
                </td>

                {/* Picture Upload */}
                <td className="px-6 py-4">
                  <div className="relative group/upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group-hover/upload:border-blue-500 group-hover/upload:bg-blue-100">
                      <Upload className="w-5 h-5 text-gray-500 group-hover/upload:text-blue-600" />
                    </div>
                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleAdd}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-semibold">Add New Student</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
              <div className="w-5 h-5 border-2 border-white rounded border-t-transparent animate-spin opacity-0 group-hover:opacity-100"></div>
            </div>
            <span className="font-bold text-lg">Save All Students</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewStudentField;