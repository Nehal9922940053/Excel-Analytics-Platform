



import React, {useState} from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

const FileUpload = ({onFileUpload, isLoading}) => {
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB
        return allowedTypes.includes(file.type) && file.size <= maxSize;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full inline-flex mx-auto mb-4">
                    <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Excel File</h2>
                <p className="text-gray-600">Get instant analysis and interactive charts</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div
                    className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
                        dragOver 
                            ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                            : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="space-y-4 text-center">
                        <Upload className={`mx-auto h-12 w-12 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="space-y-1">
                            <label
                                htmlFor="file-upload"
                                className="block w-full cursor-pointer bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Choose File
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="text-xs text-gray-500">or drag & drop here</p>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">XLSX, XLS up to 10MB</p>
                    </div>
                </div>

                {file && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 flex items-center justify-center">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={!file || isLoading}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-sm rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload & Analyze
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FileUpload;