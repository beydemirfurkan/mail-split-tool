import { useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function ExcelReader() {
  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(1000); // Öntanımlı değer 1000

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChunkSizeChange = (e) => {
    setChunkSize(Number(e.target.value));
  };

  const handleProcessFile = async () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const chunks = splitArrayIntoChunks(json, chunkSize);

        // JSZip ile zip dosyası oluştur.
        const zip = new JSZip();
        chunks.forEach((chunk, index) => {
          const ws = XLSX.utils.json_to_sheet(chunk);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          zip.file(`list_${index + 1}.xlsx`, excelBuffer);
        });

        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, 'email_chunks.zip');
      } catch (error) {
        console.error('An error occurred: ', error);
      }
    };
    reader.readAsArrayBuffer(file);
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
            accept=".xlsx, .xls, .csv"
            className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleProcessFile}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            İşle ve İndir
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
