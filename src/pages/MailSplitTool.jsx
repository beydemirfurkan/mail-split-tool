import { useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function ExcelReader() {
  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChunkSizeChange = (e) => {
    setChunkSize(Number(e.target.value));
  };

  const handleProcessFile = async () => {
    setIsLoading(true);
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'txt') {
      processTxtFile();
    } else {
      processExcelFile();
    }
  };

  const processTxtFile = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const lines = content.split('\n').map(line => ({ email: line.trim() }));
      const chunks = splitArrayIntoChunks(lines, chunkSize);
      await createAndDownloadZip(chunks, 'txt');
    };
    reader.readAsText(file);
  };

  const processExcelFile = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      const chunks = splitArrayIntoChunks(json, chunkSize);
      await createAndDownloadZip(chunks, 'xlsx');
    };
    reader.readAsArrayBuffer(file);
  };

  const createAndDownloadZip = async (chunks, originalFileType) => {
    const zip = new JSZip();
    chunks.forEach((chunk, index) => {
      if (originalFileType === 'txt') {
        const blob = new Blob([chunk.map(item => item.email).join('\n')], { type: 'text/plain' });
        zip.file(`chunk_${index + 1}.txt`, blob);
      } else {
        const ws = XLSX.utils.json_to_sheet(chunk);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        zip.file(`chunk_${index + 1}.xlsx`, excelBuffer);
      }
    });

    const zipContent = await zip.generateAsync({ type: 'blob' });
    saveAs(zipContent, `chunks.zip`);
    setIsLoading(false);
  };
  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">E-posta Bölme</h2>
      <label className="block mb-2 text-gray-700" htmlFor="from-input">
        Bölünecek öğe sayısı
      </label>
      <input
        id="from-input"
        type="number"
        placeholder="Bölünecek öğe sayısı"
        onChange={handleChunkSizeChange}
        value={chunkSize}
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <label className="block mb-2 text-gray-700" htmlFor="subject-input">
        Bölünecek Liste
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv, .txt"
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleProcessFile}
        disabled={isLoading}
        className={`mt-4 text-white font-bold py-2 px-4 rounded-lg transition-colors ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'İşleniyor...' : 'İşle ve İndir'}
      </button>
    </div>
  );
}

export default ExcelReader;

function splitArrayIntoChunks(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
