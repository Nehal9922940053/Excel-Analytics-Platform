
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getAnalyses } from "../redux/slices/analysisSlice";
// import { logout } from "../redux/slices/authSlice";
// import { Users, FileText, Calendar, User, FileSpreadsheet, Trash2, Eye, Brain, BarChart3, LogOut, ArrowLeft } from "lucide-react";

// const AdminPanel = ({ onBackToDashboard }) => {
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("users");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const dispatch = useDispatch();
//   const { analyses } = useSelector((state) => state.analysis);
//   const { userInfo } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo && userInfo.isAdmin) {
//       fetchUsers();
//       dispatch(getAnalyses());
//     }
//   }, [userInfo, dispatch]);

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const token = userInfo.token;
//       const response = await fetch("/api/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const token = userInfo.token;
//         const response = await fetch(`/api/admin/users/${userId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           setUsers(users.filter((user) => user._id !== userId));
//         } else {
//           console.error("Error deleting user");
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   const handleDeleteAnalysis = async (analysisId) => {
//     if (window.confirm("Are you sure you want to delete this analysis?")) {
//       try {
//         const token = userInfo.token;
//         const response = await fetch(`/api/admin/analyses/${analysisId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           dispatch(getAnalyses());
//         } else {
//           console.error("Error deleting analysis");
//         }
//       } catch (error) {
//         console.error("Error deleting analysis:", error);
//       }
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   // Quick stats for admin overview
//   const totalUsers = users.length;
//   const totalAnalyses = analyses.length;
//   const adminUsers = users.filter((u) => u.isAdmin).length;
//   const adminChartsGenerated = analyses.filter(a => a.chartConfig && a.userId?.isAdmin).length || 0;
//   const userChartsGenerated = analyses.filter(a => a.chartConfig && !a.userId?.isAdmin).length || 0;
//   const totalChartsGenerated = adminChartsGenerated + userChartsGenerated;

//   const renderUsersTable = () => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.map((user) => (
//             <tr key={user._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {user.isAdmin ? "Yes" : "No"}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {new Date(user.createdAt).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 {!user.isAdmin && (
//                   <button
//                     onClick={() => handleDeleteUser(user._id)}
//                     className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <Trash2 className="h-3 w-3 mr-1" />
//                     Delete
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {users.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-500 text-lg">No users found</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderAnalysesTable = () => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {analyses.map((analysis) => (
//             <tr key={analysis._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {analysis.originalName || analysis.filename}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.userId?.email || "Unknown"}
//                 {analysis.userId?.isAdmin && (
//                   <span className="ml-2 inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                     Admin
//                   </span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.rowCount || (analysis.data ? analysis.data.length : 0)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {new Date(analysis.createdAt).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 <button
//                   onClick={() => handleDeleteAnalysis(analysis._id)}
//                   className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                 >
//                   <Trash2 className="h-3 w-3 mr-1" />
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {analyses.length === 0 && (
//         <div className="text-center py-12">
//           <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-500 text-lg">No analyses found</p>
//         </div>
//       )}
//     </div>
//   );

//   if (!userInfo?.isAdmin) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
//         <div className="text-center">
//           <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-500">You need admin privileges to view this panel.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {/* Updated Header with Back Button and Profile */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//             <div className="flex items-center mb-4 sm:mb-0">
//               {onBackToDashboard && (
//                 <button
//                   onClick={onBackToDashboard}
//                   className="mr-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-all duration-300"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </button>
//               )}
//               <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mr-3">
//                 <Users className="h-6 w-6 text-white" />
//               </div>
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
//                 Admin Panel
//               </h1>
//             </div>
            
//             {/* User Profile and Actions */}
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfile(!showProfile)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   <User className="h-4 w-4 text-gray-600" />
//                   <span className="text-sm font-medium text-gray-700">{userInfo?.email}</span>
//                   <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
//                     Admin
//                   </span>
//                 </button>
                
//                 {/* Profile Dropdown */}
//                 {showProfile && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{userInfo?.email}</p>
//                       <p className="text-xs text-gray-500">Administrator</p>
//                     </div>
//                     <button
//                       onClick={onBackToDashboard}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                     >
//                       <BarChart3 className="h-4 w-4 mr-2" />
//                       Data Analysis
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                     >
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               <button
//                 onClick={() => {
//                   fetchUsers();
//                   dispatch(getAnalyses());
//                 }}
//                 disabled={isLoading}
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                   <Users className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Users</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-purple-100 p-2 rounded-lg mr-3">
//                   <BarChart3 className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Analyses</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalAnalyses}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-green-100 p-2 rounded-lg mr-3">
//                   <User className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Charts Generated</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalChartsGenerated}</p>
//                   <div className="flex justify-between text-xs text-gray-500 mt-1">
//                     <span>Admin: {adminChartsGenerated}</span>
//                     <span>Users: {userChartsGenerated}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
//             <div className="sm:hidden">
//               <select
//                 className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-transparent focus:outline-none focus:ring-0 font-medium text-gray-700"
//                 value={activeTab}
//                 onChange={(e) => setActiveTab(e.target.value)}
//               >
//                 <option value="users">Users</option>
//                 <option value="analyses">Analyses</option>
//               </select>
//             </div>
//             <div className="hidden sm:block">
//               <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-8 overflow-x-auto">
//                   <button
//                     className={`${
//                       activeTab === "users"
//                         ? "border-purple-500 text-purple-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
//                     onClick={() => setActiveTab("users")}
//                   >
//                     <Users className="h-4 w-4 mr-1" />
//                     Users
//                   </button>
//                   <button
//                     className={`${
//                       activeTab === "analyses"
//                         ? "border-purple-500 text-purple-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
//                     onClick={() => setActiveTab("analyses")}
//                   >
//                     <FileSpreadsheet className="h-4 w-4 mr-1" />
//                     Analyses
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {activeTab === "users" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//                   <div className="flex items-center">
//                     <Users className="h-5 w-5 text-blue-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">Users Management</h3>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">Manage all users in the system</p>
//                 </div>
//                 {isLoading ? (
//                   <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//                   </div>
//                 ) : (
//                   renderUsersTable()
//                 )}
//               </div>
//             )}

//             {activeTab === "analyses" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
//                   <div className="flex items-center">
//                     <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">All Analyses</h3>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">View all analyses across all users</p>
//                 </div>
//                 {renderAnalysesTable()}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getAdminStats } from "../redux/slices/analysisSlice";
// import { logout } from "../redux/slices/authSlice";
// import { Users, FileText, Calendar, User, FileSpreadsheet, Trash2, Eye, Brain, BarChart3, LogOut, ArrowLeft } from "lucide-react";

// const AdminPanel = ({ onBackToDashboard }) => {
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("users");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [userAnalyses, setUserAnalyses] = useState([]);
//   const [allUserHistories, setAllUserHistories] = useState([]);
//   const dispatch = useDispatch();
//   const { stats } = useSelector((state) => state.analysis);
//   const { userInfo } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo && userInfo.isAdmin) {
//       fetchUsers();
//       fetchAdminStats();
//          fetchUserAnalyses();
//       fetchAllUserHistories();
//     }
//   }, [userInfo, dispatch]);

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const token = userInfo.token;
//       const response = await fetch("/api/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//    const fetchUserAnalyses = async () => {
//     try {
//       const token = userInfo.token;
//       const response = await fetch("/api/admin/analyses", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUserAnalyses(data);
//       }
//     } catch (error) {
//       console.error("Error fetching user analyses:", error);
//     }
//   };

//   const fetchAdminStats = async () => {
//     dispatch(getAdminStats());
//   };

//   const fetchAllUserHistories = async () => {
//     try {
//       const token = userInfo.token;
//       const response = await fetch("/api/admin/user-histories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setAllUserHistories(data);
//       }
//     } catch (error) {
//       console.error("Error fetching user histories:", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const token = userInfo.token;
//         const response = await fetch(`/api/admin/users/${userId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           setUsers(users.filter((user) => user._id !== userId));
//         } else {
//           console.error("Error deleting user");
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   const handleDeleteAnalysis = async (analysisId) => {
//     if (window.confirm("Are you sure you want to delete this analysis?")) {
//       try {
//         const token = userInfo.token;
//         const response = await fetch(`/api/admin/analyses/${analysisId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//         fetchUserAnalyses();
//           fetchAllUserHistories();
//           fetchAdminStats();
//         } else {
//           console.error("Error deleting analysis");
//         }
//       } catch (error) {
//         console.error("Error deleting analysis:", error);
//       }
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//   };


//    const handleRefresh = () => {
//     fetchUsers();
//     fetchAdminStats();
//     fetchUserAnalyses();
//     fetchAllUserHistories();
//   };

//   // Admin Stats (only users' data, not admin's)
//   const totalUsers = users.length;
//   // Use stats from Redux or fallback to local calculations
//   const totalUserAnalyses = stats?.totalAnalyses || userAnalyses.length;
//   const totalUserCharts = stats?.chartsGenerated ||
//     userAnalyses.filter(analysis =>
//       analysis.chartConfig && analysis.chartConfig.xAxis && analysis.chartConfig.yAxis
//     ).length;

//   const renderUsersTable = () => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.map((user) => (
//             <tr key={user._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {user.isAdmin ? "Yes" : "No"}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {new Date(user.createdAt).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 {!user.isAdmin && (
//                   <button
//                     onClick={() => handleDeleteUser(user._id)}
//                     className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <Trash2 className="h-3 w-3 mr-1" />
//                     Delete
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {users.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-500 text-lg">No users found</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderUserAnalysesTable = () => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {userAnalyses.map((analysis) => (
//             <tr key={analysis._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {analysis.originalName || analysis.filename}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.userId?.email || "Unknown"}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.rowCount || (analysis.data ? analysis.data.length : 0)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {new Date(analysis.createdAt).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 <button
//                   onClick={() => handleDeleteAnalysis(analysis._id)}
//                   className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                 >
//                   <Trash2 className="h-3 w-3 mr-1" />
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {userAnalyses.length === 0 && (
//         <div className="text-center py-12">
//           <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-500 text-lg">No analyses found</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderUserHistoriesTable = () => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {allUserHistories.map((analysis) => (
//             <tr key={analysis._id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {analysis.originalName || analysis.filename}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.userId?.email || "Unknown"}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {analysis.rowCount || (analysis.data ? analysis.data.length : 0)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {new Date(analysis.createdAt).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 <button
//                   onClick={() => handleDeleteAnalysis(analysis._id)}
//                   className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                 >
//                   <Trash2 className="h-3 w-3 mr-1" />
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {allUserHistories.length === 0 && (
//         <div className="text-center py-12">
//           <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-500 text-lg">No user history found</p>
//         </div>
//       )}
//     </div>
//   );

//   if (!userInfo?.isAdmin) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
//         <div className="text-center">
//           <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-500">You need admin privileges to view this panel.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {/* Updated Header with Back Button and Profile */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//             <div className="flex items-center mb-4 sm:mb-0">
//               {onBackToDashboard && (
//                 <button
//                   onClick={onBackToDashboard}
//                   className="mr-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-all duration-300"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </button>
//               )}
//               <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mr-3">
//                 <Users className="h-6 w-6 text-white" />
//               </div>
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
//                 Admin Panel
//               </h1>
//             </div>
            
//             {/* User Profile and Actions */}
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfile(!showProfile)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   <User className="h-4 w-4 text-gray-600" />
//                   <span className="text-sm font-medium text-gray-700">{userInfo?.email}</span>
//                   <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
//                     Admin
//                   </span>
//                 </button>
                
//                 {/* Profile Dropdown */}
//                 {showProfile && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{userInfo?.email}</p>
//                       <p className="text-xs text-gray-500">Administrator</p>
//                     </div>
//                     <button
//                       onClick={onBackToDashboard}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                     >
//                       <BarChart3 className="h-4 w-4 mr-2" />
//                       Dashboard
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                     >
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               <button
//                 onClick={() => {
//                       fetchUsers();
//     fetchAdminStats();
//     fetchUserAnalyses();
//     fetchAllUserHistories();
//                   // fetchUsers();
//                   // fetchAdminStats();
//                   // fetchAllUserHistories();
//                 }}
//                 disabled={isLoading}
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                   <Users className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Users</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-purple-100 p-2 rounded-lg mr-3">
//                   <BarChart3 className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">User Analyses</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalUserAnalyses}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="bg-green-100 p-2 rounded-lg mr-3">
//                   <Brain className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">User Charts Generated</p>
//                   <p className="text-2xl font-bold text-gray-900">{totalUserCharts}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
//             <div className="sm:hidden">
//               <select
//                 className="block w-full pl-3 pr-10 py-3 text-base border-0 bg-transparent focus:outline-none focus:ring-0 font-medium text-gray-700"
//                 value={activeTab}
//                 onChange={(e) => setActiveTab(e.target.value)}
//               >
//                 <option value="users">Users</option>
//                 <option value="analyses">Analyses</option>
//                 <option value="history">History</option>
//               </select>
//             </div>
//             <div className="hidden sm:block">
//               <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-8 overflow-x-auto">
//                   <button
//                     className={`${
//                       activeTab === "users"
//                         ? "border-purple-500 text-purple-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
//                     onClick={() => setActiveTab("users")}
//                   >
//                     <Users className="h-4 w-4 mr-1" />
//                     Users
//                   </button>
//                   <button
//                     className={`${
//                       activeTab === "analyses"
//                         ? "border-purple-500 text-purple-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
//                     onClick={() => setActiveTab("analyses")}
//                   >
//                     <FileSpreadsheet className="h-4 w-4 mr-1" />
//                     Analyses
//                   </button>
//                   <button
//                     className={`${
//                       activeTab === "history"
//                         ? "border-purple-500 text-purple-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
//                     onClick={() => setActiveTab("history")}
//                   >
//                     <Calendar className="h-4 w-4 mr-1" />
//                     History
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {activeTab === "users" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//                   <div className="flex items-center">
//                     <Users className="h-5 w-5 text-blue-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">Users Management</h3>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">Manage all users in the system</p>
//                 </div>
//                 {isLoading ? (
//                   <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//                   </div>
//                 ) : (
//                   renderUsersTable()
//                 )}
//               </div>
//             )}

//             {activeTab === "analyses" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
//                   <div className="flex items-center">
//                     <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">User Analyses</h3>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">View all analyses by users only</p>
//                 </div>
//                 {renderUserAnalysesTable()}
//               </div>
//             )}

//            {activeTab === "history" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
//                 <div className="flex items-center mb-6">
//                   <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
//                   <h3 className="text-lg font-semibold text-gray-900">All User Histories</h3>
//                 </div>
//                 {renderUserHistoriesTable()}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminStats } from "../redux/slices/analysisSlice";
import { logout } from "../redux/slices/authSlice";
import { Users, FileText, Calendar, User, FileSpreadsheet, Trash2, Eye, Brain, BarChart3, LogOut, ArrowLeft, ChevronDown, TrendingUp, AlertCircle } from "lucide-react";

const AdminPanel = ({ onBackToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistories, setIsLoadingHistories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userAnalyses, setUserAnalyses] = useState([]);
  const [allUserHistories, setAllUserHistories] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analysis);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
      fetchAdminStats();
      fetchUserAnalyses(); 
      fetchAllUserHistories();
    }
  }, [userInfo, dispatch]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = userInfo.token;
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error fetching users:", response.status);
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAnalyses = async () => {
    try {
      const token = userInfo.token;
      const response = await fetch("/api/admin/analyses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserAnalyses(data);
      } else {
        console.error("Error fetching user analyses:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user analyses:", error);
    }
  };

  const fetchAdminStats = async () => {
    dispatch(getAdminStats());
  };

  const fetchAllUserHistories = async () => {
    setIsLoadingHistories(true);
    setError(null);
    try {
      const token = userInfo?.token;
      if (!token) {
        setError("No authentication token found");
        return;
      }

      console.log("Fetching user histories with token:", token.substring(0, 20) + "...");
      
      const response = await fetch("/api/admin/user-histories", {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched histories:", data);
        setAllUserHistories(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json();
        console.error("Error fetching user histories:", response.status, errorData);
        setError(`Failed to fetch histories: ${response.status}`);
        setAllUserHistories([]);
      }
    } catch (error) {
      console.error("Error fetching user histories:", error);
      setError(error.message || "Failed to fetch user histories");
      setAllUserHistories([]);
    } finally {
      setIsLoadingHistories(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = userInfo.token;
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          console.error("Error deleting user");
          setError("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.message);
      }
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      try {
        const token = userInfo.token;
        const response = await fetch(`/api/admin/analyses/${analysisId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          fetchUserAnalyses();
          fetchAllUserHistories();
          fetchAdminStats();
        } else {
          console.error("Error deleting analysis");
          setError("Failed to delete analysis");
        }
      } catch (error) {
        console.error("Error deleting analysis:", error);
        setError(error.message);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefresh = () => {
    setError(null);
    fetchUsers();
    fetchAdminStats();
    fetchUserAnalyses();
    fetchAllUserHistories();
  };

  const totalUsers = users.length;
  const totalUserAnalyses = stats?.totalAnalyses || userAnalyses.length;
  const totalUserCharts = stats?.chartsGenerated || 
    userAnalyses.filter(analysis => 
      analysis.chartConfig && analysis.chartConfig.xAxis && analysis.chartConfig.yAxis
    ).length;

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isAdmin ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {!user.isAdmin && (
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </div>
  );

  const renderUserAnalysesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userAnalyses.map((analysis) => (
            <tr key={analysis._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {analysis.originalName || analysis.filename}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {analysis.userId?.email || "Unknown"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {analysis.rowCount || (analysis.data ? analysis.data.length : 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(analysis.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDeleteAnalysis(analysis._id)}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {userAnalyses.length === 0 && (
        <div className="text-center py-12">
          <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No analyses found</p>
        </div>
      )}
    </div>
  );

  const renderUserHistoriesTable = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-4 bg-blue-50 rounded-xl border border-blue-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
          <p className="text-sm text-gray-600">{allUserHistories.length} total analyses</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600">{totalUserCharts} charts generated</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoadingHistories ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading histories...</span>
        </div>
      ) : allUserHistories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No user history found</p>
        </div>
      ) : (
        allUserHistories.map((analysis) => (
          <div key={analysis._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedHistoryId(expandedHistoryId === analysis._id ? null : analysis._id)}>
              <div className="flex items-start gap-4 flex-1">
                <FileText className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{analysis.originalName || analysis.filename}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="inline-flex items-center">
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      {analysis.rowCount || (analysis.data ? analysis.data.length : 0)} records
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedHistoryId === analysis._id ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Expanded Content */}
            {expandedHistoryId === analysis._id && (
              <>
                {/* Chart Config */}
                {analysis.chartConfig && (analysis.chartConfig.xAxis || analysis.chartConfig.yAxis) && (
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {analysis.chartConfig.chartType || 'Line'} Chart
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {analysis.chartConfig.yAxis} vs {analysis.chartConfig.xAxis}
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {analysis.summary && (
                  <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm mb-2">AI Insights</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {analysis.summary}
                        </p>
                        {analysis.summary && analysis.summary.length > 200 && (
                          <button className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700">
                            Show More
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      By <span className="font-medium text-gray-900">{analysis.userId?.email || "Unknown"}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all">
                    <Eye className="h-4 w-4 mr-2" />
                    View Analysis
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(analysis._id)}
                    className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );

  if (!userInfo?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You need admin privileges to view this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="mr-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              )}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mr-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                Admin Panel
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
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                </button>
                
                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userInfo?.email}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <button
                      onClick={onBackToDashboard}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
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
                disabled={isLoading || isLoadingHistories}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">User Analyses</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUserAnalyses}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Brain className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">User Charts Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUserCharts}</p>
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
                <option value="users">Users</option>
                <option value="analyses">Analyses</option>
                <option value="history">History</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  <button
                    className={`${
                      activeTab === "users"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Users
                  </button>
                  <button
                    className={`${
                      activeTab === "analyses"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                    onClick={() => setActiveTab("analyses")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    Analyses
                  </button>
                  <button
                    className={`${
                      activeTab === "history"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                    onClick={() => setActiveTab("history")}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    History
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Users Management</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Manage all users in the system</p>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  renderUsersTable()
                )}
              </div>
            )}

            {activeTab === "analyses" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">User Analyses</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">View all analyses by users only</p>
                </div>
                {renderUserAnalysesTable()}
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">All User Histories</h3>
                </div>
                {renderUserHistoriesTable()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;