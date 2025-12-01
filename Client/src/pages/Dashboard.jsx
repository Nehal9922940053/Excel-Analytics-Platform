

import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getAnalyses, uploadFile, setCurrentAnalysis, getUserStats, getAdminStats} from "../redux/slices/analysisSlice";
import { logout } from "../redux/slices/authSlice";
import FileUpload from "../components/FileUpload";
import DataTable from "../components/DataTable";
import Chart from "../components/Chart";
import AdminPanel from "../pages/AdminPanel";
import AnalysisHistory from "../components/AnalysisHistory";
import { Users, FileSpreadsheet, BarChart3, Brain, Eye, LogOut, User, Settings } from "lucide-react";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);
    const { analyses, currentAnalysis, isLoading, stats, isSuccess, message } = useSelector((state) => state.analysis);

    console.log("Dashboard - userInfo.isAdmin:", userInfo?.isAdmin);
    console.log("Dashboard - stats:", stats);

    // Initial load - fetch appropriate data based on user role
    useEffect(() => {
        if (userInfo) {
            console.log("Loading data for user:", userInfo.email, "isAdmin:", userInfo.isAdmin);
            dispatch(getAnalyses());
            dispatch(getUserStats());
        }
    }, [userInfo, dispatch]);

    // Refresh stats when chart configuration is saved
    useEffect(() => {
        if (isSuccess && message?.includes("Chart configuration saved")) {
            console.log("Chart saved, refreshing stats");
            dispatch(getAnalyses());
            dispatch(getUserStats());
        }
    }, [isSuccess, message, dispatch]);

    const handleFileUpload = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(uploadFile(formData));
        setActiveTab("analyze");
    };

    const handleSelectAnalysis = (analysis) => {
        dispatch(setCurrentAnalysis(analysis));
        setActiveTab("analyze");
        dispatch(getUserStats());
    };

    const handleRefresh = () => {
        console.log("Refreshing - isAdmin:", userInfo?.isAdmin);
        dispatch(getAnalyses());
        dispatch(getUserStats());
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleBackFromAdminPanel = () => {
        setShowAdminPanel(false);
        // Refresh data when returning from Admin Panel
        handleRefresh();
    };

    // If user is admin and chooses to view admin panel, show it
    if (userInfo?.isAdmin && showAdminPanel) {
        return <AdminPanel onBackToDashboard={handleBackFromAdminPanel} />;
    }

    const renderTabContent = () => {
        if (activeTab === "upload") {
            return <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />;
        }

        if (activeTab === "analyze" && currentAnalysis) {
            return (
                <div className="space-y-6">
                    <DataTable analysisId={currentAnalysis._id} columns={currentAnalysis.columns} />
                    <Chart
                        analysisId={currentAnalysis._id}
                        columns={currentAnalysis.columns}
                        chartConfig={currentAnalysis.chartConfig}
                    />
                </div>
            );
        }

        if (activeTab === "analyze" && !currentAnalysis) {
            return (
                <div className="text-center py-12">
                    <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Selected</h3>
                    <p className="text-gray-500 mb-6">Select an analysis from your history to view data and charts.</p>
                    <button
                        onClick={() => setActiveTab("history")}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        View History
                        <BarChart3 className="ml-2 h-4 w-4" />
                    </button>
                </div>
            );
        }

        if (activeTab === "history") {
            return (
                <AnalysisHistory
                    analyses={analyses}
                    onSelectAnalysis={handleSelectAnalysis}
                    isLoading={isLoading}
                />
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Updated Header with Profile and Admin Panel */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg mr-3">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                        </div>
                        
                        {/* User Profile and Actions */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                    <User className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">{userInfo?.email}</span>
                                    {userInfo?.isAdmin && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </button>
                                
                                {/* Profile Dropdown */}
                                {showProfile && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{userInfo?.email}</p>
                                            <p className="text-xs text-gray-500">
                                                {userInfo?.isAdmin ? 'Administrator' : 'User'}
                                            </p>
                                        </div>
                                        {userInfo?.isAdmin && (
                                            <button
                                                onClick={() => {
                                                    setShowAdminPanel(true);
                                                    setShowProfile(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Admin Panel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards - Show appropriate stats based on user role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Total Uploads Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        My Uploads
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.totalAnalyses ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Generated Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <BarChart3 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Charts Generated</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.chartsGenerated ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Brain className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">AI Insights</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.aiInsights ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Active Analysis Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <Eye className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Analysis</p>
                                    <p className="text-2xl font-bold text-gray-900">{currentAnalysis ? 1 : 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="sm:hidden">
                            <select
                                className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-transparent focus:outline-none focus:ring-0 font-medium text-gray-700"
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                            >
                                <option value="upload">Upload File</option>
                                <option value="analyze">Analyze Data</option>
                                <option value="history">History</option>
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                    <button
                                        className={`${
                                            activeTab === "upload"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                                        onClick={() => setActiveTab("upload")}
                                    >
                                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                                        Upload File
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === "analyze"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300 ${!currentAnalysis ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setActiveTab("analyze")}
                                        disabled={!currentAnalysis}
                                    >
                                        <BarChart3 className="h-4 w-4 mr-1" />
                                        Analyze Data
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === "history"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                                        onClick={() => setActiveTab("history")}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        History
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;