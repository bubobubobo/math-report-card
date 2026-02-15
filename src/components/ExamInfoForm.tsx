import React, { useState, useEffect } from 'react';
import type { ExamInfo, ScoreInfo } from '../types';
import { Check, Edit2 } from 'lucide-react';

interface ExamInfoFormProps {
    onSave: (info: ExamInfo) => void;
}

const ExamInfoForm: React.FC<ExamInfoFormProps> = ({ onSave }) => {
    const [isLocked, setIsLocked] = useState(false);

    const [examName, setExamName] = useState('');
    const [round, setRound] = useState<number>(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [scoreDistribution, setScoreDistribution] = useState<ScoreInfo[]>([]);

    const handleTotalQuestionsChange = (val: number) => {
        setTotalQuestions(val);
        if (val <= 0) {
            setScoreDistribution([]);
            return;
        }

        // Preserve existing scores if possible, otherwise init with 0
        const newDist: ScoreInfo[] = [];
        for (let i = 1; i <= val; i++) {
            const existing = scoreDistribution.find(s => s.questionNumber === i);
            newDist.push(existing || { questionNumber: i, score: 0 });
        }
        setScoreDistribution(newDist);
    };

    const updateScoreInfo = (qNum: number, scoreVal: number) => {
        setScoreDistribution(scoreDistribution.map(s =>
            s.questionNumber === qNum ? { ...s, score: scoreVal } : s
        ));
    };

    const handleSave = () => {
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
            scoreDistribution
        };

        onSave(info);
        setIsLocked(true);
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
                            value={round}
                            onChange={(e) => setRound(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">응시 인원</label>
                        <input
                            type="number"
                            value={totalStudents}
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
                            value={totalQuestions}
                            onChange={(e) => handleTotalQuestionsChange(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="예: 20"
                        />
                    </div>
                </div>

                {scoreDistribution.length > 0 && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">문항별 배점</label>
                        <div className="grid grid-cols-5 gap-2">
                            {scoreDistribution.map((s) => (
                                <div key={s.questionNumber} className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500">{s.questionNumber}</span>
                                    <input
                                        type="number"
                                        value={s.score}
                                        onChange={(e) => updateScoreInfo(s.questionNumber, Number(e.target.value))}
                                        className="w-full text-center text-xs p-1 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
