import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ReportData, WrongQuestion, Comment, ScoreInfo } from '../types';

import { MATH_METADATA } from '../data/metadata';

interface InputFormProps {
    onSubmit: (data: ReportData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    const [examName, setExamName] = useState('');
    const [round, setRound] = useState<number | ''>('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalStudents, setTotalStudents] = useState<number | ''>('');
    const [totalQuestions, setTotalQuestions] = useState<number | ''>('');
    const [scoreDistribution, setScoreDistribution] = useState<ScoreInfo[]>([]);

    // Basic Info State
    const [studentName, setStudentName] = useState('');
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
    const [score, setScore] = useState<number | ''>('');

    const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);

    // Comments state
    const [overallEval, setOverallEval] = useState('');
    const [improvement, setImprovement] = useState('');

    // Update score distribution when total questions changes
    const handleTotalQuestionsChange = (val: number | '') => {
        setTotalQuestions(val);
        if (val === '' || val <= 0) {
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
        if (!examName || !studentName || score === '') {
            alert('시험 이름, 학생 이름, 점수는 필수항목입니다.');
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
            examInfo: {
                examName,
                startDate,
                endDate,
                round: Number(round) || 0,
                totalStudents: Number(totalStudents) || 0,
                totalQuestions: Number(totalQuestions) || 0,
                scoreDistribution
            }
        };

        onSubmit(reportData);
    };

    // Helper to get dropdown options based on current selection
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
        <div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">시험 정보 입력</h2>

                    {/* Exam Info Section */}
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">시험 이름</label>
                                <input
                                    type="text"
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="예: 2024년 1학기 중간고사"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">회차</label>
                                <input
                                    type="number"
                                    value={round}
                                    onChange={(e) => setRound(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">응시 인원</label>
                                <input
                                    type="number"
                                    value={totalStudents}
                                    onChange={(e) => setTotalStudents(e.target.value === '' ? '' : Number(e.target.value))}
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">전체 문항 수</label>
                                <input
                                    type="number"
                                    value={totalQuestions}
                                    onChange={(e) => handleTotalQuestionsChange(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="예: 20"
                                />
                            </div>
                        </div>

                        {/* Score Distribution Grid */}
                        {scoreDistribution.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">문항별 배점 정보</label>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                    {scoreDistribution.map((s) => (
                                        <div key={s.questionNumber} className="flex flex-col items-center p-2 border rounded bg-slate-50">
                                            <span className="text-xs text-slate-500 mb-1">{s.questionNumber}번</span>
                                            <input
                                                type="number"
                                                value={s.score}
                                                onChange={(e) => updateScoreInfo(s.questionNumber, Number(e.target.value))}
                                                className="w-full text-center text-sm p-1 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>


                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">개별 정보 입력</h2>


                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 bg-slate-50 p-2 rounded">학생 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">학생 이름</label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="홍길동"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">시험 날짜</label>
                                <input
                                    type="date"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Score Input */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 bg-slate-50 p-2 rounded">점수 입력</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">점수</label>
                            <input
                                type="number"
                                value={score}
                                onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none max-w-ws"
                                placeholder="0-100"
                            />
                        </div>
                    </section>

                    {/* Wrong Questions */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-700 bg-slate-50 p-2 rounded w-full mr-4">틀린 문항 (오답 분석)</h3>
                            <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition whitespace-nowrap">
                                <Plus size={16} /> 문항 추가
                            </button>
                        </div>

                        {wrongQuestions.length === 0 && (
                            <p className="text-slate-400 text-sm italic">틀린 문항이 없습니다.</p>
                        )}

                        {wrongQuestions.map((q) => (
                            <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative animate-fade-in">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(q.id)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"
                                    title="삭제"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">문항 번호</label>
                                        <input
                                            type="number"
                                            value={q.questionNumber}
                                            onChange={(e) => updateQuestion(q.id, 'questionNumber', e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">과목</label>
                                        <select
                                            value={q.subject}
                                            onChange={(e) => updateQuestion(q.id, 'subject', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        >
                                            {getSubjects().map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">대단원</label>
                                        <select
                                            value={q.majorChapter}
                                            onChange={(e) => updateQuestion(q.id, 'majorChapter', Number(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        >
                                            <option value={0}>선택</option>
                                            {getMajorChapters(q.subject).map(m => <option key={m.id} value={m.id}>{m.id}. {m.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">중단원</label>
                                        <select
                                            value={q.minorChapter}
                                            onChange={(e) => updateQuestion(q.id, 'minorChapter', Number(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                            disabled={!q.majorChapter}
                                        >
                                            <option value={0}>선택</option>
                                            {getMinorChapters(q.subject, q.majorChapter).map(m => <option key={m.id} value={m.id}>{m.id}. {m.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">유형</label>
                                        <select
                                            value={q.questionType}
                                            onChange={(e) => updateQuestion(q.id, 'questionType', Number(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                            disabled={!q.minorChapter}
                                        >
                                            <option value={0}>선택</option>
                                            {getQuestionTypes(q.subject, q.majorChapter, q.minorChapter).map(t => <option key={t.id} value={t.id}>{t.id}. {t.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">정답률 (%)</label>
                                        <input
                                            type="number"
                                            value={q.correctRate}
                                            onChange={(e) => updateQuestion(q.id, 'correctRate', e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Comments */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 bg-slate-50 p-2 rounded">학습 평가</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">총평</label>
                            <textarea
                                value={overallEval}
                                onChange={(e) => setOverallEval(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                placeholder="학생의 성취도에 대한 전반적인 평가를 입력하세요."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">이번 시험을 통해 개선할 점</label>
                            <textarea
                                value={improvement}
                                onChange={(e) => setImprovement(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                placeholder="구체적인 학습 가이드와 개선 방향을 입력하세요."
                            />
                        </div>
                    </section>

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg"
                        >
                            성적표 생성하기
                        </button>
                    </div>
                </div>




            </form>
        </div>
    );
};

export default InputForm;
