import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({children, adminOnly = false}) => {
    const {userInfo} = useSelector((state) => state.auth);

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !userInfo.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;
