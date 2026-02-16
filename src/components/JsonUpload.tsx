import React, { useState, useCallback } from 'react';
import { Upload, FileJson, CheckCircle, XCircle } from 'lucide-react';
import type { StudentAnalysis } from '../types';

interface JsonUploadProps {
    onJsonLoaded?: (data: StudentAnalysis[]) => void;
    className?: string;
}

const JsonUpload: React.FC<JsonUploadProps> = ({ onJsonLoaded, className = '' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFile = useCallback((file: File) => {
        if (!file.name.endsWith('.json')) {
            setUploadStatus('error');
            setErrorMessage('JSON 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content);

                // Validate that it's an array
                if (!Array.isArray(jsonData)) {
                    throw new Error('JSON 파일은 배열 형식이어야 합니다.');
                }

                setFileName(file.name);
                setUploadStatus('success');
                setErrorMessage('');

                if (onJsonLoaded) {
                    onJsonLoaded(jsonData);
                }
            } catch (error) {
                setUploadStatus('error');
                setErrorMessage(error instanceof Error ? error.message : 'JSON 파싱 실패');
                console.error('JSON parsing error:', error);
            }
        };

        reader.onerror = () => {
            setUploadStatus('error');
            setErrorMessage('파일 읽기 실패');
        };

        reader.readAsText(file);
    }, [onJsonLoaded]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    return (
        <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${className}`}>
            <div className="p-4">
                <h3 className="text-xl font-bold text-slate-800 mb-3">3. JSON 결과 업로드</h3>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : uploadStatus === 'success'
                            ? 'border-green-500 bg-green-50'
                            : uploadStatus === 'error'
                                ? 'border-red-500 bg-red-50'
                                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                        }`}
                >
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-3">
                        {uploadStatus === 'success' ? (
                            <>
                                <CheckCircle size={48} className="text-green-600" />
                                <p className="text-sm font-semibold text-green-700">업로드 성공!</p>
                                <p className="text-xs text-green-600">{fileName}</p>
                            </>
                        ) : uploadStatus === 'error' ? (
                            <>
                                <XCircle size={48} className="text-red-600" />
                                <p className="text-sm font-semibold text-red-700">업로드 실패</p>
                                <p className="text-xs text-red-600">{errorMessage}</p>
                            </>
                        ) : (
                            <>
                                {isDragging ? (
                                    <FileJson size={48} className="text-blue-600" />
                                ) : (
                                    <Upload size={48} className="text-slate-400" />
                                )}
                                <p className="text-sm font-semibold text-slate-700">
                                    {isDragging ? '파일을 놓아주세요' : 'JSON 파일을 드래그하거나 클릭하세요'}
                                </p>
                                <p className="text-xs text-slate-500">AI가 생성한 JSON 결과를 업로드하세요</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JsonUpload;
