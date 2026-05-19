import React, { useMemo, useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CssBaseline,
    IconButton,
    AppBar,
    Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";

import { routelistScreens } from "../../Utils/routelist";
import { colorTheme } from "../../Utils/colortheme";
import AccountMenu from "../AvatarMenu/AvatarMenu";
import RoleGuard from "../Guards/RoleGuard";

const drawerWidth = 240;

export const Sidebar = () => {
    const { user } = useSelector((state) => state.userAuth);
    const roleId = user?.role_id;

    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = useMemo(() => {
        return routelistScreens
            .filter((r) => r.icon) // only show routes that have icon
            .filter((r) => !r.allowedRoles?.length || r.allowedRoles.includes(roleId))
            .map((r) => ({
                screenName: r.screenName,
                linkTo: r.linkTo,
                icon: r.icon,
            }));
    }, [roleId]);

    const isActive = (itemLink) => {
        if (location.pathname === itemLink) return true;

        if (itemLink === "/articles" && location.pathname.startsWith("/article-preview")) return true;
        if (itemLink === "/articles" && location.pathname === "/main-form") return true;

        return false;
    };

    const drawer = (
        <div>
            <Box
                component="a"
                href={`${process.env.REACT_APP_WEB_BASE_URL}/`}
                target="_blank"
                rel="noreferrer"
                sx={{
                    p: 2,
                    textAlign: "center",
                    justifyContent: "center",
                    margin: "auto",
                    mt: 2,
                }}
            >
                <img
                    src={`${process.env.REACT_APP_ADMIN_PANEL_BASE_URL}/logo-CZubvXOe.png`}
                    alt="Logo"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            </Box>

            <List sx={{ mt: 5 }}>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.screenName}
                        component={Link}
                        to={item.linkTo}
                        selected={isActive(item.linkTo)}
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            bgcolor: isActive(item.linkTo) ? colorTheme.primary : "inherit",
                            color: isActive(item.linkTo) ? "white" : "inherit",
                            "&:hover": { bgcolor: colorTheme.primary, color: "white" },
                        }}
                    >
                        <ListItemIcon sx={{ color: isActive(item.linkTo) ? "white" : "inherit" }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.screenName} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    width: { xs: "100%", sm: "100%", md: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: { md: "white", sm: colorTheme.primary, xs: colorTheme.primary },
                }}
                elevation={1}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xs: "block", sm: "block", md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />
                    <AccountMenu />
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "block", md: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "none", md: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    px: 3,
                    width: { xs: "100%", sm: "100%", md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />

                <Routes>
                    {routelistScreens.map((r, i) => (
                        <Route
                            key={i}
                            path={r.linkTo}
                            element={<RoleGuard allowedRoles={r.allowedRoles}>{r.element}</RoleGuard>}
                        />
                    ))}
                </Routes>
            </Box>
        </Box>
    );
};
