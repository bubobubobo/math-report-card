import React, { useState } from 'react';
import { Plus, Trash2, FileCheck } from 'lucide-react';
import type { ReportData, WrongQuestion, Comment, ExamInfo } from '../types';
import { MATH_METADATA } from '../data/metadata';

interface StudentInfoFormProps {
    examInfo: ExamInfo | null;
    onSubmit: (data: ReportData) => void;
}

const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ examInfo, onSubmit }) => {
    // Basic Info State
    const [studentName, setStudentName] = useState('');
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
    const [score, setScore] = useState<number>(0);

    const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);

    // Comments state
    const [overallEval, setOverallEval] = useState('');
    const [improvement, setImprovement] = useState('');

    const addQuestion = () => {
        const newQuestion: WrongQuestion = {
            id: crypto.randomUUID(),
            questionNumber: 0,
            subject: Object.keys(MATH_METADATA.subjects)[0] || '',
            majorChapter: 0,
            minorChapter: 0,
            questionType: 0,
            correctRate: 0,
        };
        setWrongQuestions([...wrongQuestions, newQuestion]);
    };

    const removeQuestion = (id: string) => {
        setWrongQuestions(wrongQuestions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof WrongQuestion, value: any) => {
        setWrongQuestions(wrongQuestions.map(q => {
            if (q.id === id) {
                return { ...q, [field]: value };
            }
            return q;
        }));
    };

    const handleGenerateReport = () => {
        if (!examInfo) {
            alert('먼저 시험 정보를 입력하고 저장해주세요.');
            return;
        }
        if (!studentName) {
            alert('학생 이름을 입력해주세요.');
            return;
        }

        const comments: Comment[] = [
            {
                id: 'eval',
                sectionTitle: '전체적인 총평',
                content: overallEval
            },
            {
                id: 'improv',
                sectionTitle: '이번 시험을 통해 개선할 점',
                content: improvement
            }
        ];

        const reportData: ReportData = {
            studentName,
            examDate,
            score: Number(score),
            wrongQuestions,
            comments,
            examInfo: examInfo
        };

        onSubmit(reportData);
        // Optional: clear form or give feedback? User didn't specify, but I'll leave it as is for continuous entry.
        alert(`'${studentName}' 학생의 성적표가 생성되었습니다.`);
    };

    const getSubjects = () => Object.keys(MATH_METADATA.subjects);

    const getMajorChapters = (subject: string) => {
        const subj = MATH_METADATA.subjects[subject];
        return subj ? Object.entries(subj.majorChapters).map(([id, data]) => ({ id: Number(id), name: data.name })) : [];
    };

    const getMinorChapters = (subject: string, majorId: number) => {
        const subj = MATH_METADATA.subjects[subject];
        const major = subj?.majorChapters[majorId];
        return major ? Object.entries(major.minorChapters).map(([id, data]) => ({ id: Number(id), name: data.name })) : [];
    };

    const getQuestionTypes = (subject: string, majorId: number, minorId: number) => {
        const subj = MATH_METADATA.subjects[subject];
        const major = subj?.majorChapters[majorId];
        const minor = major?.minorChapters[minorId];
        return minor ? Object.entries(minor.questionTypes).map(([id, name]) => ({ id: Number(id), name })) : [];
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-8">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">개별 정보 입력</h2>

            {/* Basic Info */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">1. 학생 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">학생 이름</label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="홍길동"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">시험 날짜</label>
                        <input
                            type="date"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Score Input */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">2. 점수</h3>
                <div>
                    <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="0-100"
                    />
                </div>
            </section>

            {/* Wrong Questions */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">3. 오답 분석</h3>
                    <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition">
                        <Plus size={14} /> 추가
                    </button>
                </div>

                {wrongQuestions.map((q) => (
                    <div key={q.id} className="p-3 border border-slate-200 rounded bg-slate-50 relative">
                        <button
                            type="button"
                            onClick={() => removeQuestion(q.id)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"
                        >
                            <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="block text-slate-400 mb-1">번호</label>
                                <input
                                    type="number"
                                    value={q.questionNumber}
                                    onChange={(e) => updateQuestion(q.id, 'questionNumber', Number(e.target.value))}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">정답률</label>
                                <input
                                    type="number"
                                    value={q.correctRate}
                                    onChange={(e) => updateQuestion(q.id, 'correctRate', Number(e.target.value))}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-slate-400 mb-1">과목/단원/유형</label>
                                <div className="flex gap-1">
                                    <select
                                        value={q.subject}
                                        onChange={(e) => updateQuestion(q.id, 'subject', e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        {getSubjects().map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <select
                                        value={q.majorChapter}
                                        onChange={(e) => updateQuestion(q.id, 'majorChapter', Number(e.target.value))}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value={0}>-</option>
                                        {getMajorChapters(q.subject).map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                                    </select>
                                    <select
                                        value={q.minorChapter}
                                        onChange={(e) => updateQuestion(q.id, 'minorChapter', Number(e.target.value))}
                                        className="w-full p-1 border rounded"
                                        disabled={!q.majorChapter}
                                    >
                                        <option value={0}>-</option>
                                        {getMinorChapters(q.subject, q.majorChapter).map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                                    </select>
                                    <select
                                        value={q.questionType}
                                        onChange={(e) => updateQuestion(q.id, 'questionType', Number(e.target.value))}
                                        className="w-full p-1 border rounded"
                                        disabled={!q.minorChapter}
                                    >
                                        <option value={0}>-</option>
                                        {getQuestionTypes(q.subject, q.majorChapter, q.minorChapter).map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Comments */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">4. 코멘트</h3>
                <textarea
                    value={overallEval}
                    onChange={(e) => setOverallEval(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded h-16 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="총평"
                />
                <textarea
                    value={improvement}
                    onChange={(e) => setImprovement(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded h-16 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="개선점"
                />
            </section>

            <button
                type="button"
                onClick={handleGenerateReport}
                disabled={!examInfo}
                className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition shadow-lg
                    ${examInfo ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
                <FileCheck size={20} /> 성적표 생성하기
            </button>
        </div>
    );
};

export default StudentInfoForm;
