import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  School,
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  XCircle,
  Star,
  BookOpen
} from 'lucide-react';

const ResultSummaryReport = ({data}) => {
  console.log("data: ", data);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const capitalizeSentence = (sentence) => {
  if (!sentence) return "";
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, textColor, iconColor }) => (
    <div className={`${bgColor} p-4 rounded-lg border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color = "bg-blue-500", height = "h-2" }) => (
    <div className={`w-full bg-gray-200 rounded-full ${height}`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );

  const GradeBar = ({ grade, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Grade {grade}</span>
          <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
        </div>
        <ProgressBar percentage={percentage} color={color} />
      </div>
    );
  };

  const ComparisonChart = ({ groups }) => {
    const maxValue = Math.max(...groups.map(g => g.statistics.total_examinee));
    
    return (
      <div className="space-y-4">
        {groups.map((group) => {
          const passPercentage = group.statistics.pass_percentage;
          const attendancePercentage = group.statistics.attendance_percentage;
          
          return (
            <div key={group.group_id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {group.group_name}
                </h4>
                <span className="text-sm text-gray-500">ID: {group.group_id}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pass Rate</span>
                    <span className="font-medium">{passPercentage}%</span>
                  </div>
                  <ProgressBar 
                    percentage={passPercentage} 
                    color={passPercentage > 30 ? "bg-green-500" : passPercentage > 20 ? "bg-yellow-500" : "bg-red-500"} 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span className="font-medium">{attendancePercentage}%</span>
                  </div>
                  <ProgressBar percentage={attendancePercentage} color="bg-blue-500" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-semibold text-green-700">{group.statistics.total_pass}</div>
                    <div className="text-green-600">Passed</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="font-semibold text-red-700">{group.statistics.total_fail}</div>
                    <div className="text-red-600">Failed</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-semibold text-blue-700">{group.statistics.avg_marks}</div>
                    <div className="text-blue-600">Avg Marks</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
    {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"> */}
      <div className="max-w-7xl mx-auto">  
        {/* Group Details */}
         
        <div className="space-y-6">
          {data.group_results.map((group,index) => (
            // <div key={group.group_id} className="bg-white rounded-xl shadow-lg p-6 border">

            <div
              key={group.group_id}
              className={`bg-white rounded-xl shadow-lg p-6 border ${index !== 0 ? 'print-page-break' : ''}`}
            >
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  {data.exam_and_institute_info.exam_name}
                </h3> 
              </div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  {data.exam_and_institute_info.class_name}
                </h4>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full"> {capitalizeSentence(data.exam_and_institute_info.shift) }, {group.group_name}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <StatCard
                  icon={Users}
                  title="Total"
                  value={group.statistics.total_examinee}
                  bgColor="bg-gray-50"
                  textColor="text-gray-700"
                  iconColor="text-gray-500"
                />
                <StatCard
                  icon={UserCheck}
                  title="Appeared"
                  value={group.statistics.appeared}
                  bgColor="bg-blue-50"
                  textColor="text-blue-700"
                  iconColor="text-blue-500"
                />
                <StatCard
                  icon={CheckCircle}
                  title="Passed"
                  value={group.statistics.total_pass}
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                  iconColor="text-green-500"
                />
                <StatCard
                  icon={XCircle}
                  title="Failed"
                  value={group.statistics.total_fail}
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                  iconColor="text-red-500"
                />
                <StatCard
                  icon={Target}
                  title="Pass %"
                  value={`${group.statistics.pass_percentage}%`}
                  bgColor="bg-purple-50"
                  textColor="text-purple-700"
                  iconColor="text-purple-500"
                />
                <StatCard
                  icon={Award}
                  title="Avg Marks"
                  value={group.statistics.avg_marks}
                  bgColor="bg-yellow-50"
                  textColor="text-yellow-700"
                  iconColor="text-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex justify-between items-center p-3 border rounded-lg bg-blue-50">
                  <span className="text-sm flex items-center pr-1">
                    <Target className="h-4 w-4 mr-1" />
                    Appeared Percentage 
                  </span>
                  <span className="font-semibold text-blue-700">{group.statistics.attendance_percentage}%</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                  <span className="text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Highest
                  </span>
                  <span className="font-semibold text-green-700">{group.statistics.highest_marks}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                  <span className="text-sm flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Lowest
                  </span>
                  <span className="font-semibold text-red-700">{group.statistics.lowest_marks}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg bg-emerald-50">
                  <span className="text-sm flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    A+ Grade
                  </span>
                  <span className="font-semibold text-emerald-700">{group.statistics.grade_a_plus}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Grade Distribution
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    A+: {group.statistics.grade_a_plus}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    A: {group.statistics.grade_a}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    A-: {group.statistics.grade_a_minus}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    B: {group.statistics.grade_b}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    C: {group.statistics.grade_c}
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    D: {group.statistics.grade_d}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultSummaryReport;