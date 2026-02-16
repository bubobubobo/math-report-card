import React from 'react';
import type { ReportData } from '../types';

interface ReportCardProps {
    data: ReportData;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
    const analysis = data.studentAnalysis;

    if (!analysis) {
        // Fallback for old format (if any)
        return (
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-8 print:shadow-none print:w-full">
                <header className="border-b-2 border-slate-800 pb-4 mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{data.examInfo.examName} 결과 리포트</h1>
                    <p className="text-slate-500 text-sm">
                        {data.examInfo.round}회차 | {data.examInfo.startDate} ~ {data.examInfo.endDate}
                    </p>
                    <p className="text-lg font-bold text-slate-800 mt-2">{data.studentName} 학생</p>
                </header>
            </div>
        );
    }

    return (
        <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-8 print:shadow-none print:w-full">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{data.examInfo.examName} 결과 리포트</h1>
                <p className="text-slate-500 text-sm">
                    {data.examInfo.round}회차 | {data.examInfo.startDate} ~ {data.examInfo.endDate}
                </p>
            </header>

            {/* Student Info */}
            <section className={`mb-6 p-4 rounded-lg border ${analysis.studentInfo.등수 <= 15
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-lg'
                : 'bg-slate-50 border-slate-200'
                }`}>
                <h2 className="text-xl font-bold text-slate-800 mb-3">학생 정보</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="font-semibold text-slate-600">이름:</span> <span className="text-slate-900">{analysis.studentInfo.이름}</span></div>
                    <div><span className="font-semibold text-slate-600">학교:</span> <span className="text-slate-900">{analysis.studentInfo.학교}</span></div>
                    <div><span className="font-semibold text-slate-600">반:</span> <span className="text-slate-900">{analysis.studentInfo.반}</span></div>
                    <div><span className="font-semibold text-slate-600">맞춘 개수:</span> <span className="text-slate-900">{analysis.studentInfo.맞춘개수}</span></div>
                </div>

                {/* Highlighted Score and Rank for Top 15 */}
                {analysis.studentInfo.등수 <= 15 ? (
                    <div className="mt-4 pt-4 border-t border-yellow-300 flex justify-around items-center">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-amber-700 mb-1">점수</p>
                            <p className="text-4xl font-extrabold text-amber-600">{analysis.studentInfo.점수}점</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-amber-700 mb-1">등수</p>
                            <p className="text-4xl font-extrabold text-amber-600">{analysis.studentInfo.등수}등</p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-semibold text-slate-600">점수:</span> <span className="text-slate-900 font-bold">{analysis.studentInfo.점수}점</span></div>
                        <div><span className="font-semibold text-slate-600">등수:</span> <span className="text-slate-900">{analysis.studentInfo.등수}등</span></div>
                    </div>
                )}
            </section>

            {/* Wrong Questions Table */}
            <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">틀린 문항 분석</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-slate-300">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-300 px-3 py-2 text-left font-semibold">문항번호</th>
                                <th className="border border-slate-300 px-3 py-2 text-left font-semibold">단원</th>
                                <th className="border border-slate-300 px-3 py-2 text-left font-semibold">출처</th>
                                <th className="border border-slate-300 px-3 py-2 text-left font-semibold">정답률</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.wrongQuestions.map((q, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="border border-slate-300 px-3 py-2">{q.문항번호}</td>
                                    <td className="border border-slate-300 px-3 py-2">{q.단원}</td>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {q.출처.includes('교재') ? q.출처.replace(/교재/g, '베이스캠프') : q.출처}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-2">{q.정답률}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Overall Evaluation */}
            <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">종합 평가</h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {analysis.overall}
                </p>
            </section>

            {/* Strength */}
            <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">강점</h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-green-50 p-4 rounded-lg border border-green-200">
                    {analysis.strength}
                </p>
            </section>

            {/* Weakness */}
            <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">약점 및 개선 방향</h2>
                <div className="space-y-3">
                    {analysis.weakness.map((item, idx) => {
                        const [unit, description] = Object.entries(item)[0];
                        return (
                            <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="font-bold text-slate-800 mb-2">{unit}</h3>
                                <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default ReportCard;
