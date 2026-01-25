import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { mainRoutes } from '../../Utils/routelist';
import { LinearProgress, Stack, Typography } from '@mui/material';
import { check_auth } from '../../Services/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthState, setIdleStatus } from '../../Store/slices/user_auth_slice';
import { asyncStatus, save_tokens_constant } from '../../Utils/asyncStatus';
import { PrivateRoutes } from './PrivateRoutes/PrivateRoutes';
import { PublicRoutes } from './PublicRoutes/PublicRoutes';
import { exit_session } from '../ApiHandle/apiHandle';
import ErrorPage from '../../Screen/ErrorPage';

const RouterApp = () => {
    const { check_auth_status, login_status } = useSelector((state) => state.userAuth);
    const { userAuth } = useSelector((state) => state.userAuth)
    const dispatch = useDispatch();
    

    useEffect(() => {
        if (login_status === asyncStatus.SUCCEEDED) {
            dispatch(check_auth());
            dispatch(setIdleStatus())
        }
    }, [login_status])

    useEffect(() => {
        if (check_auth_status === asyncStatus.IDLE) {
            const authTokens = localStorage.getItem(save_tokens_constant.AUTH) || null;
            if (!authTokens) {
                dispatch(setAuthState(false));
                
            } else {
                dispatch(check_auth());
                
            }
        }
    }, [check_auth_status, dispatch]);

    if (check_auth_status === asyncStatus.IDLE || check_auth_status === asyncStatus.LOADING) {
        return (
            <Stack>
                <LinearProgress color="info" />
            </Stack>
        );
    }

    if (check_auth_status === asyncStatus.ERROR) {
        return (
            <ErrorPage exitSession={exit_session} />
        );
    }
    return (
        <Router basename='/admin'>
            <Routes >
                <Route element={<PublicRoutes />}>
                    {mainRoutes.map((route, i) => {
                        const { linkTo, element, authRequired } = route;
                        return !authRequired && <Route key={i} path={linkTo} element={element} />;
                    })}
                </Route>
                <Route element={<PrivateRoutes />}>
                    {mainRoutes.map((route, i) => {
                        const { linkTo, element, authRequired } = route;
                        return authRequired && <Route key={i} path={linkTo} element={element} />;
                    })}
                </Route>
            </Routes>
        </Router>
    );
}

export default RouterApp;
