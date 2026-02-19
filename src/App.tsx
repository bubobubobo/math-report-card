import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ExamInfoForm from './components/ExamInfoForm';
import PromptDisplay from './components/PromptDisplay';
import JsonUpload from './components/JsonUpload';
import ReportCard from './components/ReportCard';
import { Download, FolderDown, Trash2 } from 'lucide-react';
import type { ReportData, ExamInfo, StudentAnalysis } from './types';

function App() {
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [reports, setReports] = useState<{ data: ReportData, imageUrl: string }[]>([]);
  const [processingReport, setProcessingReport] = useState<ReportData | null>(null);
  const [uploadedStudents, setUploadedStudents] = useState<StudentAnalysis[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleJsonUpload = (students: StudentAnalysis[]) => {
    setUploadedStudents(students);
  };

  const handleGenerateReports = () => {
    if (!examInfo) {
      alert('시험 정보가 설정되지 않았습니다.');
      return;
    }

    if (!uploadedStudents || uploadedStudents.length === 0) {
      alert('업로드된 학생 데이터가 없습니다.');
      return;
    }

    setIsGenerating(true);
    setReports([]); // Clear previous reports

    // Process students one by one with delay
    uploadedStudents.forEach((student, index) => {
      setTimeout(() => {
        const reportData: ReportData = {
          studentName: student.studentInfo.이름,
          examInfo: examInfo,
          studentAnalysis: student
        };
        setProcessingReport(reportData);

        // Turn off generating state after last student
        if (index === uploadedStudents.length - 1) {
          setTimeout(() => setIsGenerating(false), 1000);
        }
      }, index * 1000); // 1 second delay between each
    });
  };

  const handleClearAll = () => {
    if (reports.length === 0) return;
    if (confirm('모든 성적표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setReports([]);
      setExpandedIndex(null);
    }
  };

  const handleDownloadAll = async () => {
    if (reports.length === 0) return;

    const zip = new JSZip();
    const folderName = examInfo ? `${examInfo.examName}_성적표` : '성적표_모음';
    const folder = zip.folder(folderName);

    if (!folder) return;

    reports.forEach((report) => {
      // Remove data:image/png;base64, prefix
      const base64Data = report.imageUrl.split(',')[1];

      // Get class name (반)
      const className = report.data.studentAnalysis?.studentInfo.반 || '기타';

      // Create folder for the class
      const classFolder = folder.folder(className);

      if (classFolder) {
        classFolder.file(`${report.data.studentName}_성적표.png`, base64Data, { base64: true });
      }
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}.zip`);
    } catch (err) {
      console.error('Failed to generate zip:', err);
      alert('ZIP 파일 생성 중 오류가 발생했습니다.');
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
          <ExamInfoForm onSave={setExamInfo} />
          <PromptDisplay />
          <JsonUpload onJsonLoaded={handleJsonUpload} />

          {/* Generate Button */}
          <button
            onClick={handleGenerateReports}
            disabled={!examInfo || !uploadedStudents || isGenerating}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${examInfo && uploadedStudents && !isGenerating
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
          >
            {isGenerating ? '생성 중...' : `성적표 생성 ${uploadedStudents ? `(${uploadedStudents.length}명)` : ''}`}
          </button>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">생성된 성적표 ({reports.length})</h2>
            <div className="flex gap-2">
              {reports.length > 0 && !isGenerating && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition shadow-sm font-medium"
                >
                  <Trash2 size={20} />
                  초기화
                </button>
              )}
              <button
                onClick={handleDownloadAll}
                disabled={reports.length === 0 || isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition shadow-sm font-medium ${reports.length === 0 || isGenerating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                <FolderDown size={20} />
                {isGenerating ? '생성 완료 대기중...' : '전체 다운로드 (ZIP)'}
              </button>
            </div>
          </div>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
              <p className="text-sm">좌측에서 학생 정보를 입력하고 성적표를 생성해보세요.</p>
              <div className="mt-4" />
              <h3>1. 시험 정보 입력</h3>
              <div className="mt-2" />
              <p className="text-sm">시험 이름, 시험 날짜, 시험 시간, 시험 종류를 입력하고 입력 완료 버튼을 눌러 저장해주세요.</p>
              <div className="mt-4" />
              <h3>2. ai 프롬프트로 JSON파일 생성</h3>
              <div className="mt-2" />
              <p className="text-sm">프롬프트 텍스트를 복사하여 ai 프롬프트에 입력하고 엑셀 파일을 함께 업로드해 JSON파일을 생성해주세요. Claude ai 사용을 권장합니다.</p>
              <div className="mt-4" />
              <h3>3. JSON결과 업로드</h3>
              <div className="mt-2" />
              <p className="text-sm">생성된 JSON파일을 업로드하여 성적표를 생성해주세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors ${expandedIndex === index ? 'bg-slate-50' : ''}`}
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-slate-800">{report.data.studentName} 학생</span>
                      {report.data.studentAnalysis && (
                        <span className="text-sm text-slate-500">
                          {report.data.studentAnalysis.studentInfo.학교} {report.data.studentAnalysis.studentInfo.반}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {report.data.studentAnalysis && (
                        <span className="text-sm font-semibold text-blue-600">
                          {report.data.studentAnalysis.studentInfo.점수}점
                        </span>
                      )}
                      <a
                        href={report.imageUrl}
                        download={`${report.data.studentName}_성적표.png`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="다운로드"
                      >
                        <Download size={16} />
                      </a>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expandedIndex === index && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                      <div className="flex justify-end mb-4">
                        <a
                          href={report.imageUrl}
                          download={`${report.data.studentName}_성적표.png`}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download size={16} />
                          이미지 다운로드
                        </a>
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={report.imageUrl}
                          alt={`${report.data.studentName} 성적표`}
                          className="max-w-full shadow-lg rounded-lg"
                        />
                      </div>
                    </div>
                  )}
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

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl min-w-[300px] animate-in fade-in zoom-in duration-200">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800 mb-2">성적표 생성 중...</p>
              <p className="text-slate-600 font-medium">
                {reports.length} / {uploadedStudents?.length || 0} 완료
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
