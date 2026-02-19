import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const systemPrompt = `너는 고등 전문 수학 선생님이고 데이터 분석가야.
너는 지금부터 학생들의 시험 성적 결과를 엑셀 형태로 받아서 학생들이 자신의 시험 성적을 바탕으로 피드백을 받을 수 있도록 도와주는 역할을 할거야.
이를 위해 학생 이름별로 다음 항목들을 보내줘.
보내준 데이터는 javascript로 파싱해 사용할 것이기 때문에 학생별 객체를 배열에 담아 JSON파일 형식으로 보내줘.
1. studentInfo: 학생의 이름, 학교, 반, 점수, 등수, 맞춘개수(값의 형식은 맞춘 개수/전체 문항 수)를 값으로 담은 객체

2. wrongQuestions: 학생이 틀린 모든 문항에 대한 정보를 표로 시각화하려고 해.
이를 위해 각 문항별 정보를 문항번호, 단원, 출처, 정답률을 값을 담은 객체들의 배열로 보내줘.
"시험 정보" 시트를 보면 문항번호 별로 배점, 단원, 출처, 학년, 시험 유형, 정답률이 기록되어있어.
여기서 문항별 정보를{"문항번호": "문항번호","단원": "단원명","출처": "출처 + 학년" + " 시험 유형","정답률": "정답률"} 형식으로 찾아서 보내줘.

3. overall: 학생이 받은 성적에 대한 총평을 전체적인 시험 결과를 바탕으로 분석하여 250자 이상 작성해줘.
    분석할 때는 실제 시험을 본 인원으로 분석하고, 총평에 등수 등을 말해줄 때는 전체 인원을 55명인 것 처럼 말해줘.
    그리고 20등 아래의 학생은 등수를 언급하지 말아줘.

4. strength: 문항별 정답률, 등수 등의 정보를 바탕으로 학생의 강점을 250자 이내로 분석해줘.

5. weakness: 문항별 정답률, 등수 등의 정보를 바탕으로 학생의 약점을 분석해줘.
    단점에 해당하는 단원을 3개만 뽑아주고 [{"단원명" : "약점 분석"}, {"단원명" : "약점 분석"}, {"단원명" : "약점 분석"}]과 같이 배열에 담아 각 단원별 약점 내용을 작성해줘.`;

interface PromptDisplayProps {
    className?: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(systemPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('클립보드 복사에 실패했습니다.');
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${className}`}>
            <div className="relative">
                {/* Header with Copy Button */}
                <div className="flex justify-between gap-2 items-center px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">2. 예시 프롬프트 텍스트</h2>
                        <p className="text-sm py-1 text-slate-600">이 텍스트를 복사해서 결과 엑셀과 함께 AI에게 전달해주세요. 결과로 나온 JSON파일을 아래에 업로드해주세요.</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${copied
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                <span>복사됨!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                <span>복사</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Prompt Content */}
                <div className="p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-md border border-slate-200 max-h-48 overflow-y-auto">
                        {systemPrompt}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default PromptDisplay;
