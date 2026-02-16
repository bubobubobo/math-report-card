import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { parseExcelToJson } from '../utils/excelParser';
import { analyzeExamResults } from '../utils/ai';

const ExamResultForm: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');
    const [examData, setExamData] = useState<any[]>([]);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_CLAUDE_API_KEY || '');
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError('');
        setAnalysisResult('');

        try {
            const data = await parseExcelToJson(file);
            if (data.length === 0) {
                setError('엑셀 파일에 데이터가 없습니다.');
                return;
            }
            setExamData(data);
        } catch (err) {
            console.error(err);
            setError('엑셀 파일 읽기 실패. 올바른 파일인지 확인해주세요.');
        } finally {
            if (e.target) e.target.value = ''; // Reset input to allow re-upload
        }
    };

    const handleAnalyze = async () => {
        if (!apiKey) {
            setError('API Key를 입력해주세요.');
            return;
        }
        if (examData.length === 0) {
            setError('먼저 엑셀 파일을 업로드해주세요.');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const result = await analyzeExamResults(apiKey, examData);
            setAnalysisResult(result);
        } catch (err: any) {
            setError(err.message || '분석 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">시험 결과 분석</h2>

            {/* API Key Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Claude API Key</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="sk-ant-..."
                />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">성적 엑셀 파일 업로드</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition gap-2 text-slate-500"
                >
                    <FileSpreadsheet size={32} className="text-green-600" />
                    <span className="text-sm font-medium">
                        {fileName || '클릭하여 엑셀 파일 선택'}
                    </span>
                    {fileName && <span className="text-xs text-green-600">({examData.length}개 데이터 로드됨)</span>}
                </button>
            </div>

            {/* Analyze Button */}
            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || examData.length === 0}
                className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition shadow-lg
                    ${isAnalyzing || examData.length === 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {isAnalyzing ? '분석 중...' : 'AI 분석 시작'}
            </button>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Analysis Result */}
            {analysisResult && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-indigo-500" />
                        분석 결과
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {analysisResult}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamResultForm;
