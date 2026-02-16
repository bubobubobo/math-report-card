import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import type { ReportData, ExamInfo } from '../types';

interface StudentInfoFormProps {
    examInfo: ExamInfo | null;
    onSubmit: (data: ReportData) => void;
}

const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ examInfo, onSubmit }) => {
    const [studentName, setStudentName] = useState('');

    const handleGenerateReport = () => {
        if (!examInfo) {
            alert('먼저 시험 정보를 입력하고 저장해주세요.');
            return;
        }
        if (!studentName) {
            alert('학생 이름을 입력해주세요.');
            return;
        }

        const reportData: ReportData = {
            studentName,
            examInfo: examInfo
        };

        onSubmit(reportData);
        alert(`'${studentName}' 학생의 성적표가 생성되었습니다.`);
        setStudentName('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-8">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">개별 정보 입력</h2>

            {/* Basic Info */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">1. 학생 정보</h3>
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
