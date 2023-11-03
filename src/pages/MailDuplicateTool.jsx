import { useState } from 'react';

const DuplicateRemover = () => {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); 
  };

  const handleProcessAndDownload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        processText(content);
      };
      reader.readAsText(file);
    }
  };

  const processText = (text) => {
    const lines = text.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    const duplicatesRemoved = uniqueLines.length !== lines.length;
    const reportText = `
      Original Line Count: ${lines.length}
      Unique Line Count: ${uniqueLines.length}
      Duplicates Found: ${duplicatesRemoved ? 'Yes' : 'No'}
      Duplicates Removed: ${lines.length - uniqueLines.length}
    `;
    setReport(reportText);

    const blob = new Blob([uniqueLines.join('\n')], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'cleaned_data.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">E-posta Duplicate</h2>
      <label className="block mb-2 text-gray-700" htmlFor="file-input">
        Ayıklanacak Liste
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        accept=".txt"
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleProcessAndDownload}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        İşle ve İndir
      </button>
      <pre>{report}</pre>
    </div>
  );
};

export default DuplicateRemover;
