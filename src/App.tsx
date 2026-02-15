import { useState } from 'react';
import InputForm from './components/InputForm';
import ReportCard from './components/ReportCard';
import type { ReportData } from './types';

function App() {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleFormSubmit = (data: ReportData) => {
    setReportData(data);
  };

  const handleReset = () => {
    if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) {
      setReportData(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:p-0">
      {reportData ? (
        <ReportCard data={reportData} onReset={handleReset} />
      ) : (
        <InputForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}

export default App;
