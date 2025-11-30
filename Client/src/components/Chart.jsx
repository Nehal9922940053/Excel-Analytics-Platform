
import React, {useState, useEffect, useRef, useMemo} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {Bar, Line, Pie, Scatter} from "react-chartjs-2";
import { saveChartConfig, getInsights, getUserStats } from "../redux/slices/analysisSlice";
import { useDispatch, useSelector } from "react-redux";
import ThreeDChart from "./ThreeDChart";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, Save, Brain, BarChart3, LineChart, PieChart, ScatterChart, Cuboid, Layers } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Chart = ({analysisId, columns, chartConfig}) => {
    const [chartType, setChartType] = useState(chartConfig?.chartType || "bar");
    const [xAxis, setXAxis] = useState(chartConfig?.xAxis || "");
    const [yAxis, setYAxis] = useState(chartConfig?.yAxis || "");
    const [title, setTitle] = useState(chartConfig?.title || "");
    const [chartData, setChartData] = useState(null);
    const [is3D, setIs3D] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fullData, setFullData] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const chartRef = useRef(null);
    const threeDChartRef = useRef(null);
    
    const dispatch = useDispatch();
    const { isLoading: insightsLoading, message, currentAnalysis } = useSelector((state) => state.analysis);

    useEffect(() => {
        if (analysisId) {
            fetchAllData();
        }
    }, [analysisId]);

    useEffect(() => {
        if (xAxis && yAxis && fullData.length > 0) {
            generateChartData();
        }
    }, [xAxis, yAxis, chartType, fullData]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token;
            const apiUrl = import.meta.env.VITE_API_URL;
           
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // const response = await axios.get(
            //     `http://localhost:5000/api/data/${analysisId}/data?page=1&limit=10000`,
            //     config
            // );


             const response = await axios.get(
              `${apiUrl}/api/data/${analysisId}/data?page=1&limit=10000`,
            config
        );

            setFullData(response.data.data);
        } catch (error) {
            console.error("Error fetching data for chart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateChartData = () => {
        if (chartType === "pie" || chartType === "doughnut") {
            const aggregatedData = {};
            fullData.forEach((item) => {
                const key = item[xAxis];
                aggregatedData[key] = (aggregatedData[key] || 0) + (Number(item[yAxis]) || 0);
            });

            const labels = Object.keys(aggregatedData);
            const values = Object.values(aggregatedData);

            setChartData({
                labels,
                datasets: [
                    {
                        label: yAxis,
                        data: values,
                        backgroundColor: [
                            "rgba(99, 102, 241, 0.8)",
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(34, 197, 94, 0.8)",
                            "rgba(234, 179, 8, 0.8)",
                            "rgba(239, 68, 68, 0.8)",
                            "rgba(168, 85, 247, 0.8)",
                            "rgba(236, 72, 153, 0.8)",
                            "rgba(20, 184, 166, 0.8)",
                        ],
                        borderColor: [
                            "rgba(99, 102, 241, 1)",
                            "rgba(59, 130, 246, 1)",
                            "rgba(34, 197, 94, 1)",
                            "rgba(234, 179, 8, 1)",
                            "rgba(239, 68, 68, 1)",
                            "rgba(168, 85, 247, 1)",
                            "rgba(236, 72, 153, 1)",
                            "rgba(20, 184, 166, 1)",
                        ],
                        borderWidth: 2,
                    },
                ],
            });
        } else if (chartType === "scatter") {
            setChartData({
                datasets: [
                    {
                        label: `${yAxis} vs ${xAxis}`,
                        data: fullData.map((item) => ({
                            x: item[xAxis],
                            y: item[yAxis],
                        })),
                        backgroundColor: "rgba(99, 102, 241, 0.6)",
                        borderColor: "rgba(99, 102, 241, 1)",
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    },
                ],
            });
        } else {
            const labels = fullData.map((item) => item[xAxis]);
            const values = fullData.map((item) => item[yAxis]);

            setChartData({
                labels,
                datasets: [
                    {
                        label: yAxis,
                        data: values,
                        backgroundColor: chartType === "bar"
                            ? "rgba(99, 102, 241, 0.8)"
                            : "rgba(59, 130, 246, 0.6)",
                        borderColor: chartType === "bar"
                            ? "rgba(99, 102, 241, 1)"
                            : "rgba(59, 130, 246, 1)",
                        borderWidth: 2,
                        tension: 0.4,
                        fill: chartType === "line",
                    },
                ],
            });
        }
    };

 // NEW: Handle chart type change with auto-save
    const handleChartTypeChange = (newChartType) => {
        setChartType(newChartType);
        
        // Auto-save the chart configuration when chart type changes
        if (xAxis && yAxis) {
            const newChartConfig = {
                chartType: newChartType,
                xAxis,
                yAxis,
                title: title || `${yAxis} by ${xAxis}`,
            };
            
            // Dispatch save immediately
            dispatch(
                saveChartConfig({
                    id: analysisId,
                    chartConfig: newChartConfig,
                })
            );
            
            // Update stats for charts generated
            dispatch(getUserStats());
        }
    };

    // NEW: Handle axis changes with auto-save
    const handleXAxisChange = (newXAxis) => {
        setXAxis(newXAxis);
        if (newXAxis && yAxis) {
            autoSaveChartConfig(newXAxis, yAxis);
        }
    };

    const handleYAxisChange = (newYAxis) => {
        setYAxis(newYAxis);
        if (xAxis && newYAxis) {
            autoSaveChartConfig(xAxis, newYAxis);
        }
    };

    const autoSaveChartConfig = (x, y) => {
        const newChartConfig = {
            chartType,
            xAxis: x,
            yAxis: y,
            title: title || `${y} by ${x}`,
        };
        
        dispatch(
            saveChartConfig({
                id: analysisId,
                chartConfig: newChartConfig,
            })
        );
        
        dispatch(getUserStats());
    };



    const downloadChartAsPNG = async () => {
        setIsDownloading(true);
        try {
            let dataURL;
            let filename = `chart-${is3D ? '3d-' : ''}${title || 'visualization'}-${Date.now()}.png`;

            if (is3D && threeDChartRef.current) {
                dataURL = threeDChartRef.current.captureImage(true);
                if (!dataURL) {
                    throw new Error('Failed to capture 3D chart');
                }
            } else {
                const element = chartRef.current;
                if (!element) {
                    throw new Error("Chart not found. Please generate a chart first.");
                }

                const canvas = await html2canvas(element, {
                    scale: 3,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    onclone: (clonedDoc, clonedElement) => {
                        cleanOklchColors(clonedDoc);
                    }
                });

                dataURL = canvas.toDataURL('image/png', 1.0);
            }

            const link = document.createElement('a');
            link.download = filename;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Error downloading PNG:", error);
            alert(`Failed to download chart as PNG: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadChartAsPDF = async () => {
        setIsDownloading(true);
        try {
            let imgData;
            let canvasWidth, canvasHeight;
            const filename = `chart-${is3D ? '3d-' : ''}${title || 'visualization'}-${Date.now()}.pdf`;

            if (is3D && threeDChartRef.current) {
                const threeCanvas = threeDChartRef.current.getCanvas();
                if (!threeCanvas) {
                    throw new Error('3D chart canvas not available');
                }
                
                imgData = threeDChartRef.current.captureImage(true);
                canvasWidth = threeCanvas.width;
                canvasHeight = threeCanvas.height;
            } else {
                const element = chartRef.current;
                if (!element) {
                    throw new Error("Chart not found. Please generate a chart first.");
                }

                const canvas = await html2canvas(element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    onclone: (clonedDoc, clonedElement) => {
                        cleanOklchColors(clonedDoc);
                    }
                });

                imgData = canvas.toDataURL('image/png');
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
            }

            if (!imgData) {
                throw new Error('Failed to generate image data');
            }

            const pdf = new jsPDF({
                orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvasWidth, canvasHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
            pdf.save(filename);
            
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert(`Failed to download chart as PDF: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const cleanOklchColors = (clonedDoc) => {
        const allElements = clonedDoc.body.querySelectorAll('*');
        
        allElements.forEach((el) => {
            const inlineStyle = el.getAttribute('style');
            
            if (inlineStyle && inlineStyle.includes('oklch')) {
                const cleanedStyle = inlineStyle
                    .replace(/oklch\([^)]*\)/g, 'rgb(99, 102, 241)')
                    .replace(/color:\s*oklch\([^)]*\)/g, 'color: rgb(99, 102, 241)')
                    .replace(/background:\s*oklch\([^)]*\)/g, 'background: rgb(99, 102, 241)')
                    .replace(/background-color:\s*oklch\([^)]*\)/g, 'background-color: rgb(99, 102, 241)')
                    .replace(/border-color:\s*oklch\([^)]*\)/g, 'border-color: rgb(99, 102, 241)');
                el.setAttribute('style', cleanedStyle);
            }
            
            if (el.classList.contains('bg-gradient-to-r') ||
                el.classList.contains('bg-gradient-to-br') ||
                el.classList.contains('from-oklch') ||
                el.classList.contains('to-oklch')) {
                el.style.background = 'linear-gradient(to right, rgb(99, 102, 241), rgb(59, 130, 246))';
            }

            if (el.style.color && el.style.color.includes('oklch')) {
                el.style.color = 'rgb(99, 102, 241)';
            }
            if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
                el.style.backgroundColor = 'rgb(99, 102, 241)';
            }
            if (el.style.borderColor && el.style.borderColor.includes('oklch')) {
                el.style.borderColor = 'rgb(99, 102, 241)';
            }
        });

        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach(tag => {
            if (tag.textContent.includes('oklch')) {
                tag.textContent = tag.textContent
                    .replace(/oklch\([^)]*\)/g, 'rgb(99, 102, 241)')
                    .replace(/color:\s*oklch\([^)]*\)/g, 'color: rgb(99, 102, 241)')
                    .replace(/background:\s*oklch\([^)]*\)/g, 'background: rgb(99, 102, 241)')
                    .replace(/background-color:\s*oklch\([^)]*\)/g, 'background-color: rgb(99, 102, 241)');
            }
        });

        const canvasElements = clonedDoc.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            try {
                const ctx = canvas.getContext('2d');
            } catch (e) {
            }
        });
    };

    const handleSaveChart = () => {
        dispatch(
            saveChartConfig({
                id: analysisId,
                chartConfig: {
                    chartType,
                    xAxis,
                    yAxis,
                    title,
                },
            })
        );
    };

    const handleGetInsights = () => {
        dispatch(getInsights(analysisId));
    };

    const render2DChart = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chart data...</p>
                    </div>
                </div>
            );
        }

        if (!chartData) {
            return (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Select X and Y axes to generate chart</p>
                    <p className="text-gray-400 text-sm">Choose your data columns from the dropdowns above</p>
                </div>
            );
        }

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                title: {
                    display: true,
                    text: title || `${yAxis} by ${xAxis}`,
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: "'Inter', sans-serif"
                    },
                    padding: 20
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }
            },
            scales: chartType !== 'pie' ? {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            } : {}
        };

        let ChartComponent;
        switch (chartType) {
            case "bar":
                ChartComponent = Bar;
                break;
            case "line":
                ChartComponent = Line;
                break;
            case "pie":
                ChartComponent = Pie;
                break;
            case "scatter":
                ChartComponent = Scatter;
                break;
            default:
                ChartComponent = Bar;
        }

        return <ChartComponent data={chartData} options={options} />;
    };

    const render3DChart = useMemo(() => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading 3D visualization...</p>
                    </div>
                </div>
            );
        }

        if (!chartData) {
            return (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <Cuboid className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Select X and Y axes for 3D visualization</p>
                    <p className="text-gray-400 text-sm">Drag to rotate • Scroll to zoom</p>
                </div>
            );
        }
        
        return (
            <ThreeDChart
                ref={threeDChartRef}
                chartType={chartType}
                chartData={chartData}
                xAxis={xAxis}
                yAxis={yAxis}
                title={title}
            />
        );
    }, [isLoading, chartData, chartType, xAxis, yAxis, title]);

    const formatInsights = (insightsText) => {
        if (!insightsText) return [];
        
        const lines = insightsText.split('\n').filter(line => line.trim());
        return lines.map((line, idx) => ({
            id: idx,
            text: line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')
        }));
    };

    const insightsList = currentAnalysis?.summary ? formatInsights(currentAnalysis.summary) : [];

    const getChartIcon = (type) => {
        switch (type) {
            case "bar": return <BarChart3 className="h-4 w-4" />;
            case "line": return <LineChart className="h-4 w-4" />;
            case "pie": return <PieChart className="h-4 w-4" />;
            case "scatter": return <ScatterChart className="h-4 w-4" />;
            default: return <BarChart3 className="h-4 w-4" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {getChartIcon(chartType)}
                            Data Visualization
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Create interactive charts from your data</p>
                    </div>
                    
                    {/* 3D Toggle */}
                    <button
                        onClick={() => setIs3D(!is3D)}
                        className={`mt-2 sm:mt-0 inline-flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                            is3D
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                    >
                        <Layers className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{is3D ? 'Switch to 2D' : 'Switch to 3D'}</span>
                        <span className="sm:hidden">{is3D ? '2D' : '3D'}</span>
                    </button>
                </div>
            </div>

            {/* Controls - Responsive Grid */}
            <div className="px-6 py-4 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">X Axis</label>
                        <select
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={xAxis}
                            // onChange={(e) => setXAxis(e.target.value)}
                            onChange={(e) => handleXAxisChange(e.target.value)}
                        >
                            <option value="">Select Column</option>
                            {columns.map((column, index) => (
                                <option key={index} value={column}>{column}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Y Axis</label>
                        <select
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={yAxis}
                            // onChange={(e) => setYAxis(e.target.value)}
                              onChange={(e) => handleYAxisChange(e.target.value)}
                        >
                            <option value="">Select Column</option>
                            {columns.map((column, index) => (
                                <option key={index} value={column}>{column}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Chart Type</label>
                        <select
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={chartType}
                            // onChange={(e) => setChartType(e.target.value)}
                             onChange={(e) => handleChartTypeChange(e.target.value)}

                        >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="scatter">Scatter Plot</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter chart title..."
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons - Responsive Flex */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSaveChart}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Config
                    </button>

                    <button
                        onClick={handleGetInsights}
                        disabled={insightsLoading}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <Brain className="h-4 w-4 mr-2" />
                        {insightsLoading ? "Generating..." : "AI Insights"}
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                    <button
                        onClick={downloadChartAsPNG}
                        disabled={!chartData || isDownloading}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">PNG</span>
                        <span className="sm:hidden">DL</span>
                    </button>

                    <button
                        onClick={downloadChartAsPDF}
                        disabled={!chartData || isDownloading}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`mx-6 my-4 p-4 rounded-lg border-l-4 ${
                    message.includes("Error") || message.includes("Failed")
                        ? 'bg-red-50 border-red-500 text-red-800'
                        : 'bg-green-50 border-green-500 text-green-800'
                }`}>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium flex-1">{message}</span>
                    </div>
                </div>
            )}

            {/* Chart Container - Responsive Height */}
            <div
                ref={chartRef}
                className={`relative bg-white ${
                    is3D ? 'h-[400px] sm:h-[500px] lg:h-[600px]' : 'h-[300px] sm:h-[400px] lg:h-[500px]'
                }`}
            >
                {is3D ? render3DChart : render2DChart()}
            </div>

            {/* Chart Info Footer */}
            {chartData && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">Mode:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                is3D ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {is3D ? '3D Visualization' : '2D Chart'}
                            </span>
                            <span className="font-medium">Type: <span className="capitalize">{chartType}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Data Points:</span>
                            <span>{fullData.length}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Insights Section */}
            {insightsList.length > 0 && (
                <div className="px-6 py-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <div className="flex items-center mb-4">
                        <Brain className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-purple-900">AI Insights</h3>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                        {insightsList.map((insight) => (
                            <div key={insight.id} className="flex gap-3 p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                                    {insight.id + 1}
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed flex-1">{insight.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chart;