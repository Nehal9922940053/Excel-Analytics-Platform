// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import {
//   FileSpreadsheet,
//   BarChart3,
//   Brain,
//   Download,
//   Users,
//   Shield,
//   Zap,
//   TrendingUp,
//   Database,
//   Eye,
//   ChevronRight
// } from "lucide-react";

// const Home = () => {
//   const navigate = useNavigate();
//   const features = [
//     {
//       icon: <FileSpreadsheet className="h-8 w-8 text-blue-600" />,
//       title: "Excel Upload Support",
//       description: "Upload .xls or .xlsx files and instantly analyze your data with seamless parsing."
//     },
//     {
//       icon: <BarChart3 className="h-8 w-8 text-green-600" />,
//       title: "Interactive 2D & 3D Charts",
//       description: "Generate bar, line, pie, scatter, and 3D visualizations for instant insights."
//     },
//     {
//       icon: <Database className="h-8 w-8 text-indigo-600" />,
//       title: "Dynamic Axis Mapping",
//       description: "Select X and Y axes directly from your Excel column headers to customize charts."
//     },
//     {
//       icon: <Brain className="h-8 w-8 text-purple-600" />,
//       title: "AI-Powered Insights",
//       description: "Get smart summaries and key patterns automatically extracted from your data."
//     },
//     {
//       icon: <Eye className="h-8 w-8 text-teal-600" />,
//       title: "Upload History",
//       description: "Access and manage your complete upload and analysis history in the dashboard."
//     },
//     {
//       icon: <Download className="h-8 w-8 text-orange-600" />,
//       title: "Downloadable Charts",
//       description: "Export your visualizations as high-quality PNG or PDF files for presentations."
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* Header */}
//       <Header />
      
//       {/* Hero Section */}
//       <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
//         <div className="container mx-auto text-center">
//           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
//             <Zap className="mr-2 h-4 w-4" />
//             Powerful Data Visualization Platform
//           </span>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
//             Transform Excel Data into Interactive Visuals
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//             A powerful platform for uploading any Excel file (.xls or .xlsx), analyzing data,
//             and generating 2D & 3D charts. Choose X and Y axes, visualize trends, download graphs,
//             and gain AI-powered insights instantly.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate('/register')}
//               className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
//             >
//               Get Started Free
//               <TrendingUp className="ml-2 h-5 w-5 inline" />
//             </button>
//             <button
//               onClick={() => navigate('/login')}
//               className="px-8 py-4 text-lg rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 font-medium text-gray-700 hover:text-blue-600 bg-white"
//             >
//               Login
//               <Eye className="ml-2 h-5 w-5 inline" />
//             </button>
//           </div>
//         </div>
//       </section>
      
//       {/* Features Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
//         <div className="container mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
//               Everything You Need for Smart Data Analysis
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Upload, visualize, and analyze — all in one intelligent, user-friendly platform.
//             </p>
//           </div>
         
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-green-50 rounded-lg p-6 border border-gray-200"
//               >
//                 <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 text-base leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* User Types Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
//         <div className="container mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-8">Built for Users and Admins</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//             {/* Users Card */}
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
//               <Users className="h-10 w-10 text-blue-200 mb-4 mx-auto" />
//               <h3 className="text-2xl font-bold mb-4">For Users</h3>
//               <ul className="space-y-3 text-blue-100 text-base">
//                 <li>Upload Excel files and visualize instantly</li>
//                 <li>Generate 2D & 3D charts with dynamic axis mapping</li>
//                 <li>Get AI-generated insights and summaries</li>
//                 <li>Track all uploads from your dashboard</li>
//               </ul>
//             </div>
//             {/* Admins Card */}
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
//               <Shield className="h-10 w-10 text-green-200 mb-4 mx-auto" />
//               <h3 className="text-2xl font-bold mb-4">For Admins</h3>
//               <ul className="space-y-3 text-blue-100 text-base">
//                 <li>Manage users and permissions efficiently</li>
//                 <li>Monitor usage and data analytics</li>
//                 <li>Configure platform settings and reports</li>
//                 <li>Ensure smooth and secure data operations</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* CTA Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-center">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
//           Ready to Visualize Your Data?
//         </h2>
//         <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//           Upload your Excel files, create interactive visualizations, and unlock powerful insights today.
//         </p>
//         <button
//           onClick={() => navigate('/register')}
//           className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
//         >
//           Start Analyzing Now
//           <TrendingUp className="ml-2 h-5 w-5 inline" />
//         </button>
//       </section>
      
//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
//         <div className="container mx-auto text-center">
//           <div className="flex justify-center items-center space-x-2 mb-4">
//             <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
//               <BarChart3 className="h-6 w-6 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold">Excel Analytics Platform</h3>
//           </div>
//           <p className="text-gray-400 mb-4">
//             Turning your Excel sheets into smart, interactive data visualizations.
//           </p>
//           <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Header from "../components/Header";
import {
  FileSpreadsheet,
  BarChart3,
  Brain,
  Download,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Database,
  Eye,
  ChevronRight
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth); // Assuming auth slice has isAuthenticated

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <FileSpreadsheet className="h-8 w-8 text-blue-600" />,
      title: "Excel Upload Support",
      description: "Upload .xls or .xlsx files and instantly analyze your data with seamless parsing."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Interactive 2D & 3D Charts",
      description: "Generate bar, line, pie, scatter, and 3D visualizations for instant insights."
    },
    {
      icon: <Database className="h-8 w-8 text-indigo-600" />,
      title: "Dynamic Axis Mapping",
      description: "Select X and Y axes directly from your Excel column headers to customize charts."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Insights",
      description: "Get smart summaries and key patterns automatically extracted from your data."
    },
    {
      icon: <Eye className="h-8 w-8 text-teal-600" />,
      title: "Upload History",
      description: "Access and manage your complete upload and analysis history in the dashboard."
    },
    {
      icon: <Download className="h-8 w-8 text-orange-600" />,
      title: "Downloadable Charts",
      description: "Export your visualizations as high-quality PNG or PDF files for presentations."
    }
  ];

  // If authenticated, the component will redirect via useEffect, so no render needed
  if (isAuthenticated) {
    return null; // Or a loading spinner if preferred
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            <Zap className="mr-2 h-4 w-4" />
            Powerful Data Visualization Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
            Transform Excel Data into Interactive Visuals
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A powerful platform for uploading any Excel file (.xls or .xlsx), analyzing data,
            and generating 2D & 3D charts. Choose X and Y axes, visualize trends, download graphs,
            and gain AI-powered insights instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
            >
              Get Started Free
              <TrendingUp className="ml-2 h-5 w-5 inline" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-lg rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 font-medium text-gray-700 hover:text-blue-600 bg-white"
            >
              Login
              <Eye className="ml-2 h-5 w-5 inline" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Everything You Need for Smart Data Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload, visualize, and analyze — all in one intelligent, user-friendly platform.
            </p>
          </div>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-green-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* User Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Built for Users and Admins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Users Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
              <Users className="h-10 w-10 text-blue-200 mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">For Users</h3>
              <ul className="space-y-3 text-blue-100 text-base">
                <li>Upload Excel files and visualize instantly</li>
                <li>Generate 2D & 3D charts with dynamic axis mapping</li>
                <li>Get AI-generated insights and summaries</li>
                <li>Track all uploads from your dashboard</li>
              </ul>
            </div>
            {/* Admins Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
              <Shield className="h-10 w-10 text-green-200 mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">For Admins</h3>
              <ul className="space-y-3 text-blue-100 text-base">
                <li>Manage users and permissions efficiently</li>
                <li>Monitor usage and data analytics</li>
                <li>Configure platform settings and reports</li>
                <li>Ensure smooth and secure data operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Ready to Visualize Your Data?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your Excel files, create interactive visualizations, and unlock powerful insights today.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
        >
          Start Analyzing Now
          <TrendingUp className="ml-2 h-5 w-5 inline" />
        </button>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Excel Analytics Platform</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Turning your Excel sheets into smart, interactive data visualizations.
          </p>
          <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;