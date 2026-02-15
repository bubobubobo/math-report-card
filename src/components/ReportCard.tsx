import React from 'react';
import type { ReportData } from '../types';
import { MATH_METADATA } from '../data/metadata';

interface ReportCardProps {
    data: ReportData;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
    const getMajorName = (subject: string, id: number) => {
        return MATH_METADATA.subjects[subject]?.majorChapters[id]?.name || '-';
    };

    const getMinorName = (subject: string, majorId: number, minorId: number) => {
        return MATH_METADATA.subjects[subject]?.majorChapters[majorId]?.minorChapters[minorId]?.name || '-';
    };

    const getTypeName = (subject: string, majorId: number, minorId: number, typeId: number) => {
        return MATH_METADATA.subjects[subject]?.majorChapters[majorId]?.minorChapters[minorId]?.questionTypes[typeId] || '-';
    };

    return (
        <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-8 print:shadow-none print:w-full">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">수학 학습 분석표</h1>
                    <p className="text-slate-500 mt-1">Mathematics Performance Report</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-700">{data.score}점</div>
                    <div className="text-sm text-slate-600">
                        {data.studentName} | {data.examDate}
                    </div>
                </div>
            </header>

            {/* Wrong Questions Analysis */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    오답 문항 분석
                </h2>

                {data.wrongQuestions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 border-collapse">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b-2 border-slate-300">
                                <tr>
                                    <th className="px-4 py-3 border-r">번호</th>
                                    <th className="px-4 py-3 border-r">과목</th>
                                    <th className="px-4 py-3 border-r">대단원</th>
                                    <th className="px-4 py-3 border-r">중단원</th>
                                    <th className="px-4 py-3 border-r">유형</th>
                                    <th className="px-4 py-3 text-center">정답률</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                                {data.wrongQuestions.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900 border-r text-center">{q.questionNumber}</td>
                                        <td className="px-4 py-3 border-r">{q.subject}</td>
                                        <td className="px-4 py-3 border-r">{getMajorName(q.subject, q.majorChapter)}</td>
                                        <td className="px-4 py-3 border-r">{getMinorName(q.subject, q.majorChapter, q.minorChapter)}</td>
                                        <td className="px-4 py-3 border-r font-semibold text-slate-700">{getTypeName(q.subject, q.majorChapter, q.minorChapter, q.questionType)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${q.correctRate < 30 ? 'bg-red-100 text-red-700' :
                                                q.correctRate < 60 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {q.correctRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 bg-green-50 text-green-700 rounded-lg text-center">
                        틀린 문항이 없습니다. 훌륭합니다!
                    </div>
                )}
            </section>

            {/* Comments / Evaluation */}
            <section className="space-y-6">
                {data.comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            {comment.sectionTitle}
                        </h3>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {comment.content || "입력된 내용이 없습니다."}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ReportCard;
