


import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {login, reset} from "../redux/slices/authSlice";
import Header from "../components/Header";
import {
  Zap,
  TrendingUp,
  Eye,
  Mail,
  Lock,
  ShieldCheck
} from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const {email, password} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {userInfo, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (isSuccess || userInfo) {
            // if (userInfo?.isAdmin) {
            // navigate("/admin");  // Add this for admin-specific route
            // } else {
            navigate("/dashboard");
        //    };
        }

        dispatch(reset());
    }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Badge */}
                    <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Zap className="mr-2 h-4 w-4" />
                            Secure Login
                        </span>
                    </div>

                    {/* Hero Title */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
                            Welcome Back
                        </h1>
                        <p className="text-lg text-gray-600 max-w-sm mx-auto">
                            Sign in to your account and continue visualizing your data with powerful insights.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 shadow-lg" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="relative">
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="pl-10 pr-4 py-3 block w-full rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={onChange}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="pl-10 pr-4 py-3 block w-full rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        {isError && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                <div className="flex items-center">
                                    <ShieldCheck className="h-5 w-5 text-red-400 mr-2" />
                                    <h3 className="text-sm font-medium text-red-800">{message}</h3>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Link to Register */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                    Create a new account
                                </Link>
                            </p>
                        </div>

                        {/* Admin Credentials */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">Admin: admin@excelanalytics.com / admin123</p>
                        </div>
                    </form>

                    {/* Footer Note */}
                    <div className="text-center text-sm text-gray-500">
                        <p>Protected by advanced security measures.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;