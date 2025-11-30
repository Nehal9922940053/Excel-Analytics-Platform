


import React, {useState, useEffect} from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const DataTable = ({analysisId, columns}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (analysisId) {
            fetchData(currentPage);
        }
    }, [analysisId, currentPage, searchTerm]);

    const fetchData = async (page) => {
        setIsLoading(true);
        try {
              const token = JSON.parse(localStorage.getItem("userInfo")).token;
        const apiUrl = import.meta.env.VITE_API_URL; // Add this
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
             let url = `${apiUrl}/data/${analysisId}/data?page=${page}&limit=${itemsPerPage}`;
            // let url = `${import.meta.env.VITE_API_URL}/data/${analysisId}/data?page=${page}&limit=${itemsPerPage}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }

            const response = await axios.get(url, config);

            setData(response.data.data);
            setTotalPages(response.data.totalPages);
            setTotalRows(response.data.totalRows);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalRows);

    if (isLoading) {
        return (
            <div className="bg-white shadow-sm rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex-1">Data Preview</h2>
                </div>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white shadow-sm rounded-xl p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h2>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
                        <p className="text-sm text-gray-600 ml-2">({totalRows} total records)</p>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Showing {startIndex + 1}-{endIndex} of {totalRows} records
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-3 py-4 whitespace-pre-wrap text-sm text-gray-900 max-w-xs truncate">
                                        {row[column] !== undefined ? row[column] : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Responsive */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            <p>
                                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                                <span className="font-medium">{endIndex}</span> of{" "}
                                <span className="font-medium">{totalRows}</span> results
                            </p>
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px flex-wrap justify-center sm:justify-end">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </button>
                            {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                                const page = currentPage > 3 ? currentPage - 2 + i : i + 1;
                                if (page > totalPages) return null;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            currentPage === page
                                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-500">...</span>
                            )}
                            <button
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Last</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;