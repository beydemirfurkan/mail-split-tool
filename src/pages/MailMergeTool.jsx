import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ExcelMerger() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleMergeFiles = async () => {
    const combinedData = [];

    for (const file of files) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      combinedData.push(...json);
    }

    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Merged');

    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'merged.xlsx');
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">E-posta Birleştirme</h2>
      <label className="block mb-2 text-gray-700" htmlFor="subject-input">
        Birleştirilecek Liste
      </label>
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleMergeFiles}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        İşle ve İndir
      </button>
    </div>
  );
}

export default ExcelMerger;
