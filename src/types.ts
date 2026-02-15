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

export interface ReportData {
    studentName: string;
    examDate: string;
    score: number;
    wrongQuestions: WrongQuestion[];
    comments: Comment[];
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
