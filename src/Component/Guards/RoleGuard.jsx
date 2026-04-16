import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function RoleGuard({ allowedRoles = [], children }) {
    const location = useLocation();
    const { userAuth, user } = useSelector((state) => state.userAuth);

    // Not logged in
    if (!userAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const roleId = user?.role_id;

    // If role missing (edge case)
    if (!roleId) {
        return <Navigate to="/login" replace />;
    }

    // If role not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(roleId)) {
        return <Navigate to="/" replace />;
        // or: return <Navigate to="/unauthorized" replace />;
    }

    return children;
}