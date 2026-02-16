import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import ExamInfoForm from './components/ExamInfoForm';
import ExamResultForm from './components/ExamResultForm';
import ReportCard from './components/ReportCard';
import { Download, Trash2 } from 'lucide-react';
import type { ReportData, ExamInfo, StudentAnalysis } from './types';

function App() {
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [reports, setReports] = useState<{ data: ReportData, imageUrl: string }[]>([]);
  const [processingReport, setProcessingReport] = useState<ReportData | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const addReportCallback = (data: ReportData) => {
    setProcessingReport(data);
  };

  const handleBatchGenerate = (students: StudentAnalysis[]) => {
    if (!examInfo) {
      alert('시험 정보가 설정되지 않았습니다.');
      return;
    }

    // Process students one by one with delay
    students.forEach((student, index) => {
      setTimeout(() => {
        const reportData: ReportData = {
          studentName: student.studentInfo.이름,
          examInfo: examInfo,
          studentAnalysis: student
        };
        setProcessingReport(reportData);
      }, index * 1000); // 1 second delay between each
    });
  };

  const deleteReport = (index: number) => {
    if (confirm('정말로 이 성적표를 삭제하시겠습니까?')) {
      setReports(reports.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (processingReport && captureRef.current) {
      // Wait for render to stabilize (fonts, layout)
      const timer = setTimeout(() => {
        if (captureRef.current) {
          htmlToImage.toPng(captureRef.current, {
            cacheBust: true,
            backgroundColor: '#ffffff' // Ensure white background
          })
            .then((dataUrl) => {
              setReports((prev) => [...prev, { data: processingReport, imageUrl: dataUrl }]);
              setProcessingReport(null);
            })
            .catch((err) => {
              console.error("Failed to capture report image:", err);
              alert("이미지 생성 중 오류가 발생했습니다. (html-to-image)");
              setProcessingReport(null);
            });
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [processingReport]);

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans print:bg-white print:p-0">
      <div className="max-w-[1800px] mx-auto grid grid-cols-12 gap-8 print:hidden">

        {/* Left Column: Input Forms */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <ExamInfoForm onSave={setExamInfo} onBatchGenerate={handleBatchGenerate} />
          {/* <StudentInfoForm examInfo={examInfo} onSubmit={addReportCallback} /> */}
          {/* <ExamResultForm /> */}
        </div>

        {/* Right Column: Report Previews */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-bold text-slate-800">생성된 성적표 ({reports.length})</h2>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
              <p className="text-lg">성적표 이미지 생성 중...</p>
              <p className="text-sm">좌측에서 정보를 입력하고 성적표를 생성해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Changed to grid-cols-2/3 for smaller images (thumbnails) */}
              {reports.map((report, index) => (
                <div key={index} className="bg-white rounded shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition">
                  <img
                    src={report.imageUrl}
                    alt={`${report.data.studentName} 성적표`}
                    className="w-full h-auto object-contain cursor-pointer"
                    onClick={() => {
                      const win = window.open();
                      if (win) {
                        win.document.write(`<img src="${report.imageUrl}" style="width:100%"/>`);
                      }
                    }}
                  />
                  <div className="p-3 bg-slate-50 border-t flex justify-between items-center">
                    <span className="font-bold text-slate-700 truncate text-sm">{report.data.studentName}</span>
                    <div className="flex gap-2">
                      <a
                        href={report.imageUrl}
                        download={`${report.data.studentName}_성적표.png`}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="다운로드"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => deleteReport(index)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded transition"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Capture Area */}
      {processingReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -50, opacity: 0, pointerEvents: 'none' }}>
          <div ref={captureRef} className="w-[800px] min-h-[1000px] bg-white p-8 box-border">
            {/* Fixed width and min-height for consistent capture size */}
            <ReportCard data={processingReport} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
