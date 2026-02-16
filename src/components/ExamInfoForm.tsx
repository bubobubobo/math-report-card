import React, { useState } from 'react';
import type { ExamInfo, StudentAnalysis } from '../types';
import { Check, Edit2 } from 'lucide-react';
import { loadStudentAnalysis } from '../utils/jsonLoader';

interface ExamInfoFormProps {
    onSave: (info: ExamInfo) => void;
    onBatchGenerate?: (students: StudentAnalysis[]) => void;
}

const ExamInfoForm: React.FC<ExamInfoFormProps> = ({ onSave, onBatchGenerate }) => {
    const [isLocked, setIsLocked] = useState(false);

    const [examName, setExamName] = useState('');
    const [round, setRound] = useState<number>(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);

    const handleTotalQuestionsChange = (val: number) => {
        setTotalQuestions(val);
    };

    const handleSave = async () => {
        if (!examName || round === 0 || totalStudents === 0 || totalQuestions === 0) {
            alert('모든 시험 정보를 입력해주세요.');
            return;
        }

        const info: ExamInfo = {
            examName,
            startDate,
            endDate,
            round: Number(round),
            totalStudents: Number(totalStudents),
            totalQuestions: Number(totalQuestions),
            scoreDistribution: []
        };

        onSave(info);
        setIsLocked(true);

        // Load JSON and trigger batch generation
        if (onBatchGenerate) {
            try {
                const students = await loadStudentAnalysis();
                onBatchGenerate(students);
            } catch (error) {
                alert('학생 데이터 로드 실패. students_analysis.json 파일을 확인해주세요.');
                console.error(error);
            }
        }
    };

    const handleEdit = () => {
        setIsLocked(false);
    };

    if (isLocked) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-slate-800">시험 정보</h2>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                        <Edit2 size={16} /> 수정
                    </button>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold">시험명:</span> {examName}</p>
                    <p><span className="font-semibold">기간:</span> {startDate} ~ {endDate}</p>
                    <div className="flex gap-4">
                        <p><span className="font-semibold">회차:</span> {round}회</p>
                        <p><span className="font-semibold">응시인원:</span> {totalStudents}명</p>
                        <p><span className="font-semibold">문항수:</span> {totalQuestions}문항</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">시험 정보 입력</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">시험 이름</label>
                    <input
                        type="text"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="예: 2024년 1학기 중간고사"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">회차</label>
                        <input
                            type="number"
                            value={round === 0 ? '' : round}
                            onChange={(e) => setRound(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">응시 인원</label>
                        <input
                            type="number"
                            value={totalStudents === 0 ? '' : totalStudents}
                            onChange={(e) => setTotalStudents(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="명"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">시작일</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">종료일</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">전체 문항 수</label>
                        <input
                            type="number"
                            value={totalQuestions === 0 ? '' : totalQuestions}
                            onChange={(e) => handleTotalQuestionsChange(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="예: 20"
                        />
                    </div>
                </div>



                <button
                    onClick={handleSave}
                    className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-slate-900 transition flex justify-center items-center gap-2"
                >
                    <Check size={18} /> 입력 완료
                </button>
            </div>
        </div>
    );
};

export default ExamInfoForm;
