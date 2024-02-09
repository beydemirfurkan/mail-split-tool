import { useState } from 'react';

const MailFormatterTool = () => {
    const [file, setFile] = useState(null);
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setProgressMessage('');
    };

    const handleProcessAndDownload = () => {
        if (!file) {
            setProgressMessage('Lütfen bir dosya seçin.');
            return;
        }

        setIsLoading(true);
        setProgressMessage('Dosya işleniyor, lütfen bekleyin...');

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const validEmails = lines.filter(line => {
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(line);
            });

            setIsLoading(false);
            setProgressMessage('Dosya işleme tamamlandı ve indiriliyor.');
            createDownloadableFile(validEmails);
            generateReport(validEmails, lines.length);
        };

        reader.onerror = (error) => {
            console.error('Dosya okuma hatası:', error);
            setIsLoading(false);
            setProgressMessage('Dosya okuma sırasında bir hata oluştu.');
        };

        reader.readAsText(file);
    };

    const generateReport = (validEmails, totalLines) => {
        const reportText = `Total Emails: ${totalLines}\nValid Emails: ${validEmails.length}\nInvalid Emails: ${totalLines - validEmails.length}`;
        setReport(reportText);
    };

    const createDownloadableFile = (validEmails) => {
        const blob = new Blob([validEmails.join('\n')], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'formatted_emails.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">E-posta Formatlayıcı</h2>
            <label className="block mb-2 text-gray-700" htmlFor="file-input">
                Formatlanacak Liste
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
                disabled={isLoading}
                className={`mt-4 text-white font-bold py-2 px-4 rounded-lg transition-colors ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'İşleniyor...' : 'İşle ve İndir'}
            </button>
            {progressMessage && <div className="mt-2">{progressMessage}</div>}
            {report && <pre className="mt-4">{report}</pre>}
        </div>
    );
};

export default MailFormatterTool;
