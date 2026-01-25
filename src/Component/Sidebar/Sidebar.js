import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, CssBaseline, IconButton, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ResearcherRoute, routelist, routelistScreens, userRoute } from "../../Utils/routelist";
import { colorTheme } from "../../Utils/colortheme";
import AccountMenu from "../AvatarMenu/AvatarMenu";
import { useSelector } from "react-redux";

const drawerWidth = 240;

export const Sidebar = () => {
    const { user } = useSelector((state) => state.userAuth);

    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    console.log("User Role:", user);

const multiRoute = user?.role_id === 1
  ? routelist
  : user?.role_id === 2
    ? ResearcherRoute
    : userRoute; 


    const drawer = (
        <div>
            <Box 
            //onClicking navigate to https://h2research.org
            component={Link} to="https://h2research.org"
             sx={{ p: 2, textAlign: "center", justifyContent: "center", margin: 'auto', mt: 2 }}>
                <img src={"https://h2research.org/assets/logo-CZubvXOe.png"} alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
            <List sx={{ mt: 5 }}>
                {multiRoute?.map((item, index) => (
                    <ListItem
                        button
                        key={item.screenName}
                        component={Link}
                        to={item.linkTo}
                        selected={
                            location.pathname === item.linkTo ||
                            (item.linkTo === "/articles" && location.pathname === "/main-form")
                        }
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            bgcolor:
                                location.pathname === item.linkTo ||
                                    (item.linkTo === "/articles" && location.pathname === "/main-form") ||
                                    (item.linkTo === "/articles" && location.pathname === "/article-preview") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/BioMarkerHandling") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/article-authors") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/authors-library") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/countries") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/species") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/users") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/roles") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/article-type") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/research-topic") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/physiological-systems") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/organs-tissues") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/methods-of-administration") ||
                                    (item.linkTo === "/biomarker" && location.pathname === "/biomarkar-add-form")
                                    ? colorTheme.primary
                                    : 'inherit',
                            color:
                                location.pathname === item.linkTo ||
                                    (item.linkTo === "/articles" && location.pathname === "/main-form") ||
                                    (item.linkTo === "/articles" && location.pathname === "/article-preview") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/BioMarkerHandling") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/article-authors") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/authors-library") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/countries") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/species") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/users") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/roles") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/article-type") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/research-topic") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/physiological-systems") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/organs-tissues") ||
                                    (item.linkTo === "/DataManager" && location.pathname === "/methods-of-administration") ||
                                    (item.linkTo === "/biomarker" && location.pathname === "/biomarkar-add-form")
                                    ? 'white'
                                    : 'inherit',
                            "&:hover": {
                                bgcolor: colorTheme.primary,
                                color: 'white',
                            }
                        }}

                    >
                        <ListItemIcon sx={{ color: location.pathname === item.linkTo || (item.linkTo === "/articles" && location.pathname === "/main-form") ? 'white' : 'inherit' }}>
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
                    width: { xs: "100%", sm: "100%", md: `calc(100% - ${drawerWidth}px)`, lg: `calc(100% - ${drawerWidth}px)`, xl: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: { xl: "white", lg: "white", md: "white", sm: colorTheme.primary, xs: colorTheme.primary },
                }}
                elevation={1}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xs: "block", sm: "block", md: "none" } }} // Show on xs and sm, hide on md and larger
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "block", md: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Permanent drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "none", md: "block" }, // Show on md and larger, hide on xs and sm
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
                    // flexGrow: 1,
                    px: 3,
                    width: { xs: '100%', sm: "100%",md:`calc(100% - ${drawerWidth}px)`,lg:`calc(100% - ${drawerWidth}px)`,xl:`calc(100% - ${drawerWidth}px)` }
                    // width: "100%"
                }}
            >
                <Toolbar />
                <Routes>
                    {routelistScreens.map((e, i) => {
                        return <Route key={i} path={e.linkTo} element={e.element} />
                    })}
                </Routes>
            </Box>
        </Box>
    );
};
