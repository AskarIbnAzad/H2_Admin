import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
export const PrivateRoutes = () => {
    const { userAuth } = useSelector((state) => state.userAuth)
    return userAuth ? <Outlet /> : <Navigate to="/login" />;

}


