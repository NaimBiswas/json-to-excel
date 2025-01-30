import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const JsonToExcelConverter = () => {
  const [jsonData, setJsonData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportTitle, setExportTitle] = useState("")
  // Function to flatten nested JSON
  const flattenJSON = (obj = {}, parentKey = '', result = {}) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenJSON(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  };

  // Function to convert JSON to Excel
  const convertToExcel = () => {
    if (jsonData.length === 0) {
      alert('No data to export!');
      return;
    }
    console.log("On Click");
    
    setIsProcessing(true);

    // Flatten the JSON data
    const flattenedData = jsonData.map(item => flattenJSON(item));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, exportTitle);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, exportTitle+'.xlsx');

    setIsProcessing(false);
    setExportTitle("")
    setJsonData([])
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setExportTitle(file.name?.split(".")[0])

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
      } catch (error) {
        alert('Invalid JSON file!');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container">
      <h1 className="title">JSON to Excel Converter</h1>
      <p className="subtitle">Upload a JSON file and convert it to an Excel sheet.</p>
      <input className='ExportFileName' disabled={isProcessing} required onChange={(e) => setExportTitle(e?.target?.value)} type="text" value={exportTitle} placeholder='Enter Export File Name'/>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
        id="upload-json"
      />
      <label htmlFor="upload-json" className="file-upload-label">
        {isProcessing ? 'Processing...' : 'Upload JSON File'}
      </label>

      <button
        onClick={convertToExcel}
        disabled={jsonData.length === 0 || isProcessing || !exportTitle}
        className="export-button"
      >
        Export to Excel
      </button>

      {jsonData.length > 0 && (
        <p className="record-count">{jsonData.length} records loaded. Ready to export!</p>
      )}

      {isProcessing && (
        <div className="progress-bar">
          <div className="progress-bar-inner"></div>
        </div>
      )}
    </div>
  );
};

export default JsonToExcelConverter;