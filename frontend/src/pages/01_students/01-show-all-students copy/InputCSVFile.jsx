import React, { useState, useRef } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

const CSVFileInput = ({ handleCSVUpload }) => {
  const [fileName, setFileName] = useState("Choose CSV File");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "Choose CSV File");
    handleCSVUpload(e); // Call the provided handler
  };

  // const triggerFileInput = () => {
  //   fileInputRef.current.click();
  // };

  return (
    <>
      <div className="flex items-center gap-2">
        <label htmlFor="csv-upload">
          <span className="flex items-center cursor-pointer bg-blue-500 text-white gap-2 p-2.5 rounded hover:bg-blue-600 transition-colors">
            <DocumentArrowUpIcon className="w-5 h-5 flex-shrink-0" /> {fileName}
          </span>
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
    </>
  );
};

export default CSVFileInput;
