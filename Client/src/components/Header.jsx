import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {logout} from "../redux/slices/authSlice";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userInfo} = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/dashboard">
                                <h1 className="text-xl font-bold text-indigo-600">Excel Analytics</h1>
                            </Link>
                        </div>
                        {userInfo && (
                            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/dashboard"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                {userInfo.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {userInfo ? (
                            <div className="flex items-center">
                                <span className="text-gray-700 text-sm mr-4">Welcome, {userInfo.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
