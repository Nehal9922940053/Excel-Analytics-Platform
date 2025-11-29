// import React,{useState} from "react";

// const AnalysisHistory = ({ analyses, onSelectAnalysis, isLoading }) => {
//     const [expandedId, setExpandedId] = useState(null);

//       const toggleExpand = (id) => {
//         setExpandedId(expandedId === id ? null : id);
//     };

    
//     const truncateText = (text, maxLength = 150) => {
//         if (!text) return "";
//         if (text.length <= maxLength) return text;
//         return text.substring(0, maxLength) + "...";
//     };

//     const formatInsightsPreview = (summary) => {
//         if (!summary) return "No insights available";
        
//         // Remove markdown formatting
//         const cleanText = summary
//             .replace(/\*\*/g, "")
//             .replace(/^[-•*]\s*/gm, "")
//             .replace(/^\d+\.\s*/gm, "")
//             .split("\n")[0];
        
//         return cleanText || "No insights available";
//     };

//     if (isLoading) {
//         return (
//             <div className="bg-white shadow rounded-lg p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis History</h2>
//                 <p className="text-gray-500">Loading...</p>
//             </div>
//         );
//     }

//     if (!analyses || analyses.length === 0) {
//         return (
//             <div className="bg-white shadow rounded-lg p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis History</h2>
//                 <p className="text-gray-500">No analysis history available</p>
//             </div>
//         );
//     }


//        const getChartTypeIcon = (chartType) => {
//         switch (chartType) {
//             case "bar":
//                 return "📊";
//             case "line":
//                 return "📈";
//             case "pie":
//                 return "🥧";
//             case "scatter":
//                 return "⚫";
//             default:
//                 return "📉";
//         }
//     };


//       const getChartTypeLabel = (chartType) => {
//         if (!chartType) return "Not configured";
//         return chartType.charAt(0).toUpperCase() + chartType.slice(1) + " Chart";
//     };



//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-4 py-5 sm:px-6">
//                 <h2 className="text-lg font-medium text-gray-900">Analysis History</h2>
//                 <p className="mt-1 text-sm text-gray-500">Your previously uploaded files and analyses</p>
//             </div>
//             <ul className="divide-y divide-gray-200">
//                 {analyses.map((analysis) => {
//                       const hasInsights = analysis.summary && analysis.summary.trim().length > 0;
//                     const isExpanded = expandedId === analysis._id;
//                     const insightPreview = formatInsightsPreview(analysis.summary);
//                     const isLongInsight = analysis.summary && analysis.summary.length > 150;

//                 return(
//                        <li key={analysis._id} className="hover:bg-gray-50 transition-colors duration-200">
//                             <div className="px-4 py-4 sm:px-6">
//                                 {/* Top Row - File info and date */}
//                                 <div className="flex items-center justify-between mb-3">
//                                     <button
//                                         className="flex-1 text-left hover:text-indigo-700 transition-colors"
//                                         onClick={() => onSelectAnalysis(analysis)}
//                                     >
//                                         <p className="text-sm font-semibold text-indigo-600 truncate hover:underline">
//                                             {analysis.originalName || analysis.filename}
//                                         </p>
//                                     </button>
//                                     <div className="ml-2 flex-shrink-0">
//                                         <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                             {new Date(analysis.createdAt).toLocaleDateString()}
//                                         </p>
//                                     </div>
//                                 </div>
                            

// {/* Middle Row - Records count and Chart type */}
//                                 <div className="flex flex-wrap items-center gap-4 mb-3">
//                                     <div className="flex items-center text-sm text-gray-600">
//                                         <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                         </svg>
//                                     <span>{analysis.rowCount || (analysis.data ? analysis.data.length : 0)} records</span>
                                    
//                                     </div>

//                                     {analysis.chartType && (
//                                         <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
//                                             <span className="mr-2">{getChartTypeIcon(analysis.chartType)}</span>
//                                             <span className="font-medium">{getChartTypeLabel(analysis.chartType)}</span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Insights Section */}
//                                 {hasInsights && (
//                                     <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
//                                         <div className="flex items-start justify-between">
//                                             <div className="flex-1">
//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                     </svg>
//                                                     <span className="text-xs font-semibold text-purple-900">AI Insights</span>
//                                                 </div>

//                                                 {isExpanded ? (
//                                                     <div className="text-sm text-gray-700 space-y-2">
//                                                         {analysis.summary.split("\n").filter(line => line.trim()).map((line, idx) => (
//                                                             <p key={idx} className="text-gray-700 leading-relaxed">
//                                                                 {line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}
//                                                             </p>
//                                                         ))}
//                                                     </div>
//                                                 ) : (
//                                                     <p className="text-sm text-gray-700 leading-relaxed">
//                                                         {truncateText(insightPreview, 150)}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {isLongInsight && (
//                                             <button
//                                                 onClick={() => toggleExpand(analysis._id)}
//                                                 className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
//                                             >
//                                                 {isExpanded ? (
//                                                     <>
//                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                                                         </svg>
//                                                         Show Less
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                                                         </svg>
//                                                         Show More
//                                                     </>
//                                                 )}
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* View Button */}
//                                 <div className="mt-3 flex">
//                                     <button
//                                         onClick={() => onSelectAnalysis(analysis)}
//                                         className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors duration-200 border border-indigo-200"
//                                     >
//                                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                         </svg>
//                                         View Analysis
//                                     </button>
//                                 </div>
//                             </div>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };

// export default AnalysisHistory;




// import React,{useState} from "react";
// import { Brain, ChevronDown, ChevronUp, Calendar, FileText, BarChart2, PieChart, ScatterChart, Eye } from "lucide-react";

// const AnalysisHistory = ({ analyses, onSelectAnalysis, isLoading }) => {
//     const [expandedId, setExpandedId] = useState(null);
//       const chartsGenerated = analyses?.filter(analysis => analysis.chartConfig) || [];

//     const toggleExpand = (id) => {
//         setExpandedId(expandedId === id ? null : id);
//     };

//     const truncateText = (text, maxLength = 150) => {
//         if (!text) return "";
//         if (text.length <= maxLength) return text;
//         return text.substring(0, maxLength) + "...";
//     };

//     const formatInsightsPreview = (summary) => {
//         if (!summary) return "No insights available";
        
//         // Remove markdown formatting
//         const cleanText = summary
//             .replace(/\*\*/g, "")
//             .replace(/^[-•*]\s*/gm, "")
//             .replace(/^\d+\.\s*/gm, "")
//             .split("\n")[0];
        
//         return cleanText || "No insights available";
//     };

//     if (isLoading) {
//         return (
//             <div className="bg-white shadow-sm rounded-xl p-6">
//                 <div className="flex items-center mb-4">
//                     <Eye className="h-5 w-5 text-gray-400 mr-2" />
//                     <h2 className="text-lg font-semibold text-gray-900">Analysis History</h2>
//                 </div>
//                 <div className="flex justify-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!analyses || analyses.length === 0) {
//         return (
//             <div className="bg-white shadow-sm rounded-xl p-6 text-center">
//                 <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//                 <h2 className="text-lg font-semibold text-gray-900 mb-2">No Analysis History</h2>
//                 <p className="text-gray-500">Upload your first Excel file to get started.</p>
//             </div>
//         );
//     }

//     const getChartTypeIcon = (chartType) => {
//         switch (chartType) {
//             case "bar":
//                 return <BarChart2 className="h-4 w-4" />;
//             case "line":
//                 return <BarChart2 className="h-4 w-4 rotate-90" />;
//             case "pie":
//                 return <PieChart className="h-4 w-4" />;
//             case "scatter":
//                 return <ScatterChart className="h-4 w-4" />;
//             default:
//                 return <FileText className="h-4 w-4" />;
//         }
//     };

//     const getChartTypeLabel = (chartType) => {
//         if (!chartType) return "No Chart";
//         return chartType.charAt(0).toUpperCase() + chartType.slice(1) + " Chart";
//     };

//     return (
//         <div className="bg-white shadow-sm rounded-xl overflow-hidden">
//             <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
//                 <div className="flex items-center">
//                     <Eye className="h-5 w-5 text-blue-600 mr-2" />
//                     <h2 className="text-lg font-semibold text-gray-900">Analysis History</h2>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1">{analyses.length} analyses found</p>
//             </div>
//             <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
//                 {analyses.map((analysis) => {
//                     const hasInsights = analysis.summary && analysis.summary.trim().length > 0;
//                     const isExpanded = expandedId === analysis._id;
//                     const insightPreview = formatInsightsPreview(analysis.summary);
//                     const isLongInsight = analysis.summary && analysis.summary.length > 150;

//                     return (
//                         <li key={analysis._id} className="hover:bg-gray-50 transition-colors duration-200">
//                             <div className="px-6 py-4">
//                                 {/* Top Row - File info and date */}
//                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//                                     <button
//                                         className="flex-1 text-left hover:text-blue-600 transition-colors w-full sm:w-auto"
//                                         onClick={() => onSelectAnalysis(analysis)}
//                                     >
//                                         <p className="text-sm font-semibold text-gray-900 truncate hover:underline">
//                                             {analysis.originalName || analysis.filename}
//                                         </p>
//                                     </button>
//                                     <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
//                                         <div className="flex items-center text-xs text-gray-500">
//                                             <Calendar className="h-3 w-3 mr-1" />
//                                             <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Middle Row - Records count and Chart type */}
//                                 <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
//                                     <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
//                                         <FileText className="h-4 w-4 mr-2 text-gray-400" />
//                                         <span>{analysis.rowCount || (analysis.data ? analysis.data.length : 0)} records</span>
//                                     </div>

//                                     {analysis.chartType && (
//                                         <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
//                                             {getChartTypeIcon(analysis.chartType)}
//                                             <span className="font-medium ml-2">{getChartTypeLabel(analysis.chartType)}</span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Insights Section */}
//                                 {hasInsights && (
//                                     <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
//                                         <div className="flex items-start justify-between mb-2">
//                                             <div className="flex items-center gap-2">
//                                                 <Brain className="h-4 w-4 text-purple-600 flex-shrink-0" />
//                                                 <span className="text-xs font-semibold text-purple-900">AI Insights</span>
//                                             </div>
//                                             {isLongInsight && (
//                                                 <button
//                                                     onClick={() => toggleExpand(analysis._id)}
//                                                     className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1 ml-2"
//                                                 >
//                                                     {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
//                                                     {isExpanded ? 'Show Less' : 'Show More'}
//                                                 </button>
//                                             )}
//                                         </div>

//                                         <div className="text-sm text-gray-700 leading-relaxed">
//                                             {isExpanded ? (
//                                                 <div className="space-y-2">
//                                                     {analysis.summary.split("\n").filter(line => line.trim()).map((line, idx) => (
//                                                         <p key={idx} className="pl-6 border-l-2 border-purple-200">
//                                                             {line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}
//                                                         </p>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <p>{truncateText(insightPreview, 150)}</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Action Button */}
//                                 <div className="flex justify-end">
//                                     <button
//                                         onClick={() => onSelectAnalysis(analysis)}
//                                         className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                                     >
//                                         <BarChart2 className="h-4 w-4 mr-2" />
//                                         View Analysis
//                                     </button>
//                                 </div>
//                             </div>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };

// export default AnalysisHistory;


import React,{useState} from "react";
import { Brain, ChevronDown, ChevronUp, Calendar, FileText, BarChart2, PieChart, ScatterChart, Eye } from "lucide-react";

const AnalysisHistory = ({ analyses, onSelectAnalysis, isLoading }) => {
    const [expandedId, setExpandedId] = useState(null);
    
    // NEW: Automatically filter and show analyses with chart configurations
    const chartsGenerated = analyses?.filter(analysis => analysis.chartConfig) || [];

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const formatInsightsPreview = (summary) => {
        if (!summary) return "No insights available";
        
        // Remove markdown formatting
        const cleanText = summary
            .replace(/\*\*/g, "")
            .replace(/^[-•*]\s*/gm, "")
            .replace(/^\d+\.\s*/gm, "")
            .split("\n")[0];
        
        return cleanText || "No insights available";
    };

    if (isLoading) {
        return (
            <div className="bg-white shadow-sm rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <Eye className="h-5 w-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Analysis History</h2>
                </div>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!analyses || analyses.length === 0) {
        return (
            <div className="bg-white shadow-sm rounded-xl p-6 text-center">
                <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">No Analysis History</h2>
                <p className="text-gray-500">Upload your first Excel file to get started.</p>
            </div>
        );
    }

    const getChartTypeIcon = (chartType) => {
        switch (chartType) {
            case "bar":
                return <BarChart2 className="h-4 w-4" />;
            case "line":
                return <BarChart2 className="h-4 w-4 rotate-90" />;
            case "pie":
                return <PieChart className="h-4 w-4" />;
            case "scatter":
                return <ScatterChart className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getChartTypeLabel = (chartType) => {
        if (!chartType) return "No Chart";
        return chartType.charAt(0).toUpperCase() + chartType.slice(1) + " Chart";
    };

    return (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            {/* UPDATED: Header with charts generated count */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Eye className="h-5 w-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Analysis History</h2>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {chartsGenerated.length} charts generated
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{analyses.length} total analyses</p>
            </div>

            {/* UPDATED: Show message when no charts are generated yet */}
            {chartsGenerated.length === 0 ? (
                <div className="p-8 text-center">
                    <BarChart2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Generated Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first chart by selecting an analysis and configuring a visualization.</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-yellow-800">
                            <strong>Tip:</strong> Go to "Analyze Data" tab, select X and Y axes, and choose a chart type to generate your first chart.
                        </p>
                    </div>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                    {chartsGenerated.map((analysis) => {
                        const hasInsights = analysis.summary && analysis.summary.trim().length > 0;
                        const isExpanded = expandedId === analysis._id;
                        const insightPreview = formatInsightsPreview(analysis.summary);
                        const isLongInsight = analysis.summary && analysis.summary.length > 150;

                        return (
                            <li key={analysis._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <div className="px-6 py-4">
                                    {/* Top Row - File info and date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                        <button
                                            className="flex-1 text-left hover:text-blue-600 transition-colors w-full sm:w-auto"
                                            onClick={() => onSelectAnalysis(analysis)}
                                        >
                                            <p className="text-sm font-semibold text-gray-900 truncate hover:underline">
                                                {analysis.originalName || analysis.filename}
                                            </p>
                                        </button>
                                        <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPDATED: Middle Row - Records count and Chart type with axes */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{analysis.rowCount || (analysis.data ? analysis.data.length : 0)} records</span>
                                        </div>

                                        {analysis.chartConfig && (
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                                    {getChartTypeIcon(analysis.chartConfig.chartType)}
                                                    <span className="font-medium ml-2 capitalize">
                                                        {analysis.chartConfig.chartType} Chart
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                                    <span className="font-medium">
                                                        {analysis.chartConfig.xAxis} vs {analysis.chartConfig.yAxis}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Chart Title Display */}
                                    {analysis.chartConfig?.title && (
                                        <div className="mb-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                                            <p className="text-sm font-medium text-indigo-800">
                                                Chart: {analysis.chartConfig.title}
                                            </p>
                                        </div>
                                    )}

                                    {/* Insights Section */}
                                    {hasInsights && (
                                        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                                    <span className="text-xs font-semibold text-purple-900">AI Insights</span>
                                                </div>
                                                {isLongInsight && (
                                                    <button
                                                        onClick={() => toggleExpand(analysis._id)}
                                                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1 ml-2"
                                                    >
                                                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                        {isExpanded ? 'Show Less' : 'Show More'}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {isExpanded ? (
                                                    <div className="space-y-2">
                                                        {analysis.summary.split("\n").filter(line => line.trim()).map((line, idx) => (
                                                            <p key={idx} className="pl-6 border-l-2 border-purple-200">
                                                                {line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}
                                                            </p>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>{truncateText(insightPreview, 150)}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => onSelectAnalysis(analysis)}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <BarChart2 className="h-4 w-4 mr-2" />
                                            View Analysis
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default AnalysisHistory;