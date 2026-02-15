export interface WrongQuestion {
    id: string; // Unique ID for list rendering
    questionNumber: number | '';
    subject: string;
    majorChapter: number;
    minorChapter: number;
    questionType: number;
    correctRate: number | '';
}

export interface Comment {
    id: string;
    sectionTitle: string;
    content: string;
}

// Exam Information Types
export interface ScoreInfo {
    questionNumber: number;
    score: number;
}

export interface ExamInfo {
    examName: string;
    startDate: string;
    endDate: string;
    totalStudents: number;
    round: number;
    totalQuestions: number;
    scoreDistribution: ScoreInfo[];
}

export interface ReportData {
    studentName: string;
    examDate: string; // Keep for now or replace with linked ExamInfo?
    score: number;
    wrongQuestions: WrongQuestion[];
    comments: Comment[];
    examInfo?: ExamInfo; // Optional for now
}

// Metadata Types
export interface QuestionTypeMap {
    [typeNum: number]: string;
}

export interface MinorChapter {
    name: string;
    questionTypes: QuestionTypeMap;
}

export interface MajorChapter {
    name: string;
    minorChapters: {
        [minorNum: number]: MinorChapter;
    };
}

export interface Subject {
    majorChapters: {
        [majorNum: number]: MajorChapter;
    };
}

export interface MathMetadata {
    subjects: {
        [subjectName: string]: Subject;
    };
}
