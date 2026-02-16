// Exam Information Types
export interface ExamInfo {
    examName: string;
    startDate: string;
    endDate: string;
    totalStudents: number;
    round: number;
    totalQuestions: number;
    scoreDistribution: any[]; // Keeping generic or removing if unused
}

// Student Analysis Types (from JSON)
export interface WrongQuestion {
    문항번호: string;
    단원: string;
    출처: string;
    정답률: string;
}

export interface StudentInfo {
    이름: string;
    학교: string;
    반: string;
    점수: number;
    등수: number;
    맞춘개수: string;
}

export interface StudentAnalysis {
    studentInfo: StudentInfo;
    wrongQuestions: WrongQuestion[];
    overall: string;
    strength: string;
    weakness: Array<{ [key: string]: string }>;
}

// Report Data
export interface ReportData {
    studentName: string;
    examInfo: ExamInfo;
    studentAnalysis?: StudentAnalysis; // Optional for backward compatibility
}
