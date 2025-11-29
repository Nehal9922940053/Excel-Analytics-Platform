// import React from "react";
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import {Provider} from "react-redux";
// import store from "./redux/store";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import AdminPanel from "./pages/AdminPanel";
// import PrivateRoute from "./components/PrivateRoute";

// import "./App.css";

// function App() {
//     return (
//         <Provider store={store}>
//             <Router>
//                 <div className="App min-h-screen bg-gray-100">
//                     <Home />
//                     <Routes>
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/register" element={<Register />} />
//                         <Route
//                             path="/dashboard"
//                             element={
//                                 <PrivateRoute>
//                                     <Dashboard />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/admin"
//                             element={
//                                 <PrivateRoute adminOnly={true}>
//                                     <AdminPanel />
//                                 </PrivateRoute>
//                             }
//                         />
//                         {/* <Route path="/" element={<Login />} /> */}
//                     </Routes>
//                 </div>
//             </Router>
//         </Provider>
//     );
// }

// export default App;


import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App min-h-screen bg-gray-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute adminOnly={true}>
                                    <AdminPanel />
                                </PrivateRoute>
                            }
                        />

                        {/* <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} /> */}
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;