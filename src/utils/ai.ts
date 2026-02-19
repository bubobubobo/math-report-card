export const analyzeExamResults = async (apiKey: string, examData: any[]): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const systemPrompt = `너는 고등 전문 수학 선생님이고 데이터 분석가야.
    너는 지금부터 학생들의 시험 성적 결과를 엑셀 형태로 받아서 학생들이 자신의 시험 성적을 바탕으로 피드백을 받을 수 있도록 도와주는 역할을 할거야.
    이를 위해 학생 이름별로 다음 항목들을 보내줘.
    보내준 데이터는 javascript로 파싱해 사용할 것이기 때문에 하나의 객체에 담아 보내주고 아래 항목의 이름에 담아서 보내줘.
    1. studentInfo: 학생의 이름, 학교, 반, 점수, 등수, 맞춘 개수/전체 문항 수를 값으로 담은 객체

    2. wrongQuestions: 학생이 틀린 모든 문항에 대한 정보를 표로 시각화하려고 해.
    이를 위해 각 문항별 정보를 문항번호, 단원, 출처, 정답률을 값을 담은 객체들의 배열로 보내줘.
    "시험 정보" 시트를 보면 문항번호 별로 배점, 단원, 출처, 학년, 시험 유형, 정답률이 기록되어있어.
    여기서 문항별 정보를{"문항번호": "문항번호","단원": "단원명","출처": "출처 + 학년" + " 시험 유형","정답률": "정답률"} 형식으로 찾아서 보내줘.
    
    3. overall: 학생이 받은 성적에 대한 총평을 전체적인 시험 결과를 바탕으로 250자 내외로 분석해줘.
    이 때 "지금부터 강점과 약점을 자세히 살펴볼게요!"와 같은 연결 멘트는 사용하지 말아줘
    
    4. strength: 문항별 정답률, 등수 등의 정보를 바탕으로 학생의 강점을 200자 이내로 분석해줘.

    5. weakness: 문항별 정답률, 등수 등의 정보를 바탕으로 학생의 약점을 분석해줘.
        단점에 해당하는 단원을 3개만 뽑아주고 [{"단원명" : "약점 분석"}, {"단원명" : "약점 분석"}, {"단원명" : "약점 분석"}]과 같이 배열에 담아 각 단원별 약점 내용을 작성해줘.`;

    const userPrompt = `JSON 형식의 결과 데이터는 다음과 같아:
${JSON.stringify(examData, null, 2)}

위 데이터를 바탕으로 한재영 학생의 결과 분석 텍스트를 생성해줘.`;

    try {
        // Use the proxy path configured in vite.config.ts
        const response = await fetch('/api/anthropic/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5',
                max_tokens: 2000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Data:", errorData);
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.content[0].text;

    } catch (error) {
        console.error("AI Analysis failed:", error);
        throw error;
    }
};
