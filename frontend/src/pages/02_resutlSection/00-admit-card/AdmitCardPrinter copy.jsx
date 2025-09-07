import React, { useState, useEffect } from 'react';

const AdmitCardPrinter = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data structure - replace with your actual API
  const sampleStudents = [
    {
      id: 1,
      name: "Jannatul Ferdous Ishana",
      fatherName: "Abul Kaium Khan",
      class: "Seven",
      group: "Humanities",
      section: "A",
      roll: 87
    },
    {
      id: 2,
      name: "Mohammad Ali Rahman",
      fatherName: "Abdul Rahman Khan",
      class: "Seven",
      group: "Science",
      section: "B",
      roll: 45
    },
    {
      id: 3,
      name: "Fatima Khatun",
      fatherName: "Shah Alam",
      class: "Eight",
      group: "Commerce",
      section: "A",
      roll: 23
    },
    {
      id: 4,
      name: "Rafiul Islam",
      fatherName: "Nazrul Islam",
      class: "Seven",
      group: "Humanities",
      section: "C",
      roll: 12
    },
    {
      id: 5,
      name: "Ayesha Siddika",
      fatherName: "Aminul Haque",
      class: "Eight",
      group: "Science",
      section: "A",
      roll: 67
    },
    {
      id: 6,
      name: "Tanvir Ahmed",
      fatherName: "Mizanur Rahman",
      class: "Seven",
      group: "Commerce",
      section: "B",
      roll: 34
    },
    {
      id: 7,
      name: "Salma Begum",
      fatherName: "Karim Uddin",
      class: "Eight",
      group: "Humanities",
      section: "C",
      roll: 89
    },
    {
      id: 8,
      name: "Habibur Rahman",
      fatherName: "Abdul Latif",
      class: "Seven",
      group: "Science",
      section: "A",
      roll: 56
    }
  ];

  // Simulated API call - replace with your actual API endpoint
  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace this with your actual API call:
      // const response = await fetch('your-api-endpoint');
      // const data = await response.json();
      
      setStudents(sampleStudents);
    } catch (err) {
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const AdmitCard = ({ student }) => (
    <div className="admit-card border-2 border-gray-800 bg-white">
      {/* Header */}
      <div className="card-header text-center border-b border-gray-400 pb-2">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="school-logo w-12 h-12 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
            <span className="text-green-600 font-bold text-xs">PAGLA</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">PAGLA HIGH SCHOOL</h1>
            <p className="text-sm text-gray-600">Exam: Pre-Text Exam 2025</p>
          </div>
        </div>
        <div className="admit-badge inline-block px-4 py-1 border-2 border-gray-800 rounded-full">
          <span className="font-bold text-sm">ADMIT CARD</span>
        </div>
      </div>

      {/* Student Details */}
      <div className="card-body p-4 space-y-2">
        <div className="detail-row">
          <span className="label font-semibold">Name of Student:</span>
          <span className="value ml-2 italic">{student.name}</span>
        </div>
        
        <div className="detail-row">
          <span className="label font-semibold">Father's Name:</span>
          <span className="value ml-2">{student.fatherName}</span>
        </div>
        
        <div className="detail-row flex flex-wrap gap-4 text-sm">
          <div>
            <span className="label font-semibold">Class:</span>
            <span className="value ml-1">{student.class}</span>
          </div>
          <div>
            <span className="label font-semibold">Group:</span>
            <span className="value ml-1">{student.group}</span>
          </div>
          <div>
            <span className="label font-semibold">Section:</span>
            <span className="value ml-1">{student.section}</span>
          </div>
          <div>
            <span className="label font-semibold">Roll:</span>
            <span className="value ml-1">{student.roll}</span>
          </div>
        </div>
      </div>

      {/* Footer with signatures */}
      <div className="card-footer border-t border-gray-300 pt-4 pb-2">
        <div className="signature-row flex justify-between text-xs text-center">
          <div className="signature-box">
            <div className="h-8"></div>
            <p className="border-t border-gray-400 pt-1">Signature of Class Teacher</p>
          </div>
          <div className="signature-box">
            <div className="h-8"></div>
            <p className="border-t border-gray-400 pt-1">Signature of Head Master</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStudentData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Print controls - hidden when printing */}
      <div className="print-controls no-print mb-6 text-center bg-gray-50 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Admit Card Printer</h2>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={fetchStudentData}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Refresh Data
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print Cards
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Loaded {students.length} student records
        </p>
      </div>

      {/* Print area - A4 optimized layout */}
      <div className="print-area">
        {Array.from({ length: Math.ceil(students.length / 8) }, (_, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div className="cards-grid">
              {students
                .slice(pageIndex * 8, (pageIndex + 1) * 8)
                .map((student, index) => (
                  <AdmitCard key={student.id || index} student={student} />
                ))}
            </div>
            {pageIndex < Math.ceil(students.length / 8) - 1 && (
              <div className="page-break"></div>
            )}
          </div>
        ))}
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 10mm;
            page-break-after: always;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 8mm;
            height: 277mm;
          }
          
          .admit-card {
            width: 90mm;
            height: 65mm;
            padding: 3mm;
            font-size: 10px;
            page-break-inside: avoid;
          }
          
          .card-header h1 {
            font-size: 12px;
          }
          
          .card-header p {
            font-size: 9px;
          }
          
          .admit-badge span {
            font-size: 10px;
          }
          
          .card-body {
            padding: 2mm;
          }
          
          .school-logo {
            width: 8mm;
            height: 8mm;
          }
        }
        
        @media screen {
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .admit-card {
            width: 100%;
            max-width: 350px;
            min-height: 250px;
            padding: 1rem;
          }
        }
        
        .page-break {
          page-break-before: always;
        }
      `}</style>
    </div>
  );
};

export default AdmitCardPrinter;