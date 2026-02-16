import type { StudentAnalysis } from '../types';

export const loadStudentAnalysis = async (): Promise<StudentAnalysis[]> => {
    try {
        const response = await fetch('/students_analysis.json');
        if (!response.ok) {
            throw new Error('Failed to load students_analysis.json');
        }
        const data: StudentAnalysis[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading student analysis:', error);
        throw error;
    }
};
