import { useState } from 'react';

const DataProcessor = () => {
  const [mainFile, setMainFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(null);
  const [resultInfo, setResultInfo] = useState('');

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleProcessData = async () => {
    setResultInfo('');
    if (mainFile && removeFile) {
      try {
        const mainContent = await readFile(mainFile);
        const removeContent = await readFile(removeFile);

        const mainLines = mainContent.split('\n');
        const removeLines = new Set(removeContent.split('\n'));
        const filteredLines = mainLines.filter((line) => !removeLines.has(line));
        const removedCount = mainLines.length - filteredLines.length;

        setResultInfo(`Toplam ${mainLines.length} satırdan ${removedCount} tanesi çıkarıldı. İşlenen veri sayısı: ${filteredLines.length}`);

        // İndirme işlemi
        downloadFile(filteredLines.join('\n'), 'processed_data.txt');
      } catch (error) {
        setResultInfo('Bir hata oluştu. Lütfen dosyaları kontrol edin ve tekrar deneyin.');
      }
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Veri İşleyici</h2>
      <label className="block mb-2 text-gray-700" htmlFor="main-file-input">
        Ana veri
      </label>
      <input
        id="main-file-input"
        type="file"
        onChange={handleFileChange(setMainFile)}
        accept=".txt"
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <label className="block mb-2 text-gray-700" htmlFor="remove-file-input">
        Çıkarılacak veri
      </label>
      <input
        id="remove-file-input"
        type="file"
        onChange={handleFileChange(setRemoveFile)}
        accept=".txt"
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleProcessData}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        İşle ve İndir
      </button>
      {resultInfo && (
        <div className="mt-4 text-sm text-gray-600">
          {resultInfo}
        </div>
      )}
    </div>
  );
};

export default DataProcessor;
