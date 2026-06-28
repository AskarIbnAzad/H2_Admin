import {
    Grid,
    Stack,
    Typography,
    Button,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import css from "./DashboardCard.module.css";
import blue_wave from "../../assets/blue_wave.png";
import orange_wave from "../../assets/orange_wave.png";
import { useSelector } from "react-redux";
import { colorTheme } from "../../Utils/colortheme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiHandle } from "../../Config/ApiHandle/apiHandle";
import {

  PlusOutlined,
} from "@ant-design/icons";
const DashboardHome = ({ data, refetchData }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userAuth);
    const timeTrackingRef = useRef(null);
    const sessionStartRef = useRef(Date.now());
    const lastActivityRef = useRef(Date.now());
    const sessionActiveTimeRef = useRef(0); // Track only session time
    const [currentDisplayTime, setCurrentDisplayTime] = useState("0m");

    console.log("DashboardHome data", user, data);
    const navigation = useNavigate();

    // Convert time_spent string to seconds
    const parseTimeToSeconds = (timeString) => {
        if (!timeString) return 0;
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    // Initialize session tracking
    useEffect(() => {
        if (user?.role === "Researcher") {
            sessionStartRef.current = Date.now();
            lastActivityRef.current = Date.now();
            sessionActiveTimeRef.current = 0;
        }
    }, [user?.role]);

    // Function to format time in user-friendly way (hours and minutes only)
    const formatTimeUserFriendly = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return "0m";
        }
    };

    // Function to format time as HH:MM:SS for API
    const formatTimeForAPI = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Activity detection
    const handleUserActivity = () => {
        const now = Date.now();
        lastActivityRef.current = now;
    };

    // Update display time every second
    useEffect(() => {
        if (user?.role === "Researcher") {
            const displayInterval = setInterval(() => {
                const now = Date.now();
                const timeSinceLastActivity = now - lastActivityRef.current;

                // Calculate current session time if user is active
                let currentSessionTime = 0;
                if (timeSinceLastActivity < 120000) { // 2 minutes
                    currentSessionTime = Math.floor((now - sessionStartRef.current) / 1000);
                }

                // Display: backend time + current session time
                const backendTimeSeconds = data?.time_spent ? parseTimeToSeconds(data.time_spent) : 0;
                const totalDisplayTime = backendTimeSeconds + currentSessionTime;
                setCurrentDisplayTime(formatTimeUserFriendly(totalDisplayTime));
            }, 1000);

            return () => clearInterval(displayInterval);
        }
    }, [user?.role, data?.time_spent]);

    // Setup time tracking interval and activity listeners
    useEffect(() => {
        if (user?.role === "Researcher") {
            // API call to update time spent
            const updateTimeSpent = async () => {
                try {
                    const now = Date.now();
                    const timeSinceLastActivity = now - lastActivityRef.current;

                    // Calculate session time to send to backend
                    let sessionTimeToSend = 0;
                    if (timeSinceLastActivity < 120000) { // Less than 2 minutes of inactivity
                        sessionTimeToSend = Math.floor((now - sessionStartRef.current) / 1000);
                    }

                    // Reset session tracking for next interval
                    sessionStartRef.current = now;
                    lastActivityRef.current = now;

                    // Only send if there's time to add
                    if (sessionTimeToSend > 0) {
                        const timeToAddFormatted = formatTimeForAPI(sessionTimeToSend);

                        await apiHandle.post('update-time', {
                            time_spent: timeToAddFormatted, // Send only the increment
                        });

                        // Refetch data after successful update
                        if (refetchData && typeof refetchData === 'function') {
                            await refetchData();
                        }
                    } else {
                        console.log('No active time to send (user was inactive)');
                    }
                } catch (error) {
                    console.error('Error updating time:');
                }
            };

            // Handle page unload to save time before closing
            const handleBeforeUnload = async () => {
                const now = Date.now();
                const timeSinceLastActivity = now - lastActivityRef.current;

                // Calculate final session time
                let finalSessionTime = 0;
                if (timeSinceLastActivity < 120000) { // Less than 2 minutes of inactivity
                    finalSessionTime = Math.floor((now - sessionStartRef.current) / 1000);
                }

                // Send final time if there's any to save
                if (finalSessionTime > 0) {
                    const timeToAddFormatted = formatTimeForAPI(finalSessionTime);

                    // Use sendBeacon for reliable delivery on page unload
                    if (navigator.sendBeacon) {
                        const formData = new FormData();
                        formData.append('time_spent', timeToAddFormatted);
                        navigator.sendBeacon('/api/update-time', formData);
                    } else {
                        // Fallback to synchronous request
                        try {
                            await apiHandle.post('update-time', {
                                time_spent: timeToAddFormatted,
                            });
                        } catch (error) {
                            console.error('Error saving final time:', error);
                        }
                    }
                }
            };

            // Activity event listeners
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

            activityEvents.forEach(event => {
                document.addEventListener(event, handleUserActivity, true);
            });

            // Add beforeunload listener
            window.addEventListener('beforeunload', handleBeforeUnload);

            // Start tracking time
            sessionStartRef.current = Date.now();
            lastActivityRef.current = Date.now();

            // Set up interval to call API every 2 minutes (120000 ms)
            timeTrackingRef.current = setInterval(() => {
                updateTimeSpent();
            }, 120000); // 2 minutes

            // Cleanup on unmount
            return () => {
                if (timeTrackingRef.current) {
                    clearInterval(timeTrackingRef.current);
                    // Send final update when component unmounts
                    updateTimeSpent();
                }

                // Remove activity listeners
                activityEvents.forEach(event => {
                    document.removeEventListener(event, handleUserActivity, true);
                });

                // Remove beforeunload listener
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [user?.role, user?.id, user?.token, refetchData, data?.time_spent]);


    const jobsData = user?.role === "Researcher" ? [
        {
            wave_img: blue_wave,
            count: data?.totalStudies,
            title: "Number Of",
            second_txt: "Articles",
            backgroundClr: `linear-gradient(135deg, #004C78 30%, #3498DB 100%)`,
            navigate: "/"
        },
        {
            wave_img: blue_wave,
            count: data?.my_articles_count || 0,
            title: "Number Of",
            second_txt: "Articles I’ve submitted",
            backgroundClr: `linear-gradient(135deg, #004C78 30%, #3498DB 100%)`,
            navigate: "/quality-assurance"
        },
        {
            wave_img: orange_wave,
            count: user?.role === "Researcher" ? currentDisplayTime : (data?.time_spent || "0h"),
            title: "Total Time",
            second_txt: "Spent on Dashboard",
            backgroundClr: `linear-gradient(135deg, #FF8C00 30%, #FFA500 100%)`,
            navigate: "/"
        },
    ] : [
        {
            wave_img: blue_wave,
            count: data?.totalStudies,
            title: "Number Of",
            second_txt: "Articles",
            backgroundClr: `linear-gradient(135deg, #004C78 30%, #3498DB 100%)`,
            navigate: "/articles"
        },
        {
            wave_img: blue_wave,
            count: data?.totalResearcher,
            title: "Number Of",
            second_txt: "Researchers",
            backgroundClr: `linear-gradient(135deg, #004C78 30%, #3498DB 100%)`,
            navigate: "/users"
        },
        {
            wave_img: blue_wave,
            count: data?.userCount,
            title: "Number Of",
            second_txt: "Users",
            backgroundClr: `linear-gradient(135deg, #004C78 30%, #3498DB 100%)`,
            navigate: "/users"
        },
    ];

    const navigatehandle = (item) => {
        navigation(item)

    }

    return (
        <Stack mt={5}>
            {/* Greeting Section */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    animation: "fadeIn 1s ease-out, slideInFromTop 1s ease-out",
                }}
            >
                <Typography variant="caption" className={css.vendor_top_label_bl}>
                    Hi{" "}
                    <Typography
                        variant="caption"
                        className={`grediant_txt ${css.vendor_top_label_or}`}
                    >
                        {user?.name || "Admin"}{" "}
                        <Typography
                            variant="caption"
                            className={css.vendor_top_label_bl}
                        >
                            , Welcome to your{" "}
                            <Typography
                                variant="caption"
                                className={`grediant_txt ${css.vendor_top_label_or}`}
                            >
                                Dashboard
                            </Typography>
                        </Typography>
                    </Typography>
                </Typography>
                {user?.role === "Researcher" && (
                  <button
                        onClick={() => navigate("/quality-assurance")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#004c78] hover:bg-primary-900 text-white rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Article
                    </button>
                )}
            </Stack>
            <hr color={"#D1D1D1"} style={{ marginBottom: 40 }} />

            {/* Cards Section */}
            <Grid container spacing={3} alignItems={"stretch"}>
                {jobsData?.map(
                    ({ wave_img, title, count, backgroundClr, second_txt, navigate }, index) => (
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12} key={index}>
                            <Stack
                                onClick={() => navigatehandle(navigate)}
                                className={`${css.avail_jobs} animate-card`}
                                justifyContent={"space-between"}
                                sx={{
                                    cursor: "pointer",
                                    background: backgroundClr,
                                    height: "100%",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                                    },
                                }}
                            >
                                <Stack
                                    sx={{ padding: "24px", zIndex: 1 }}
                                    justifyContent={"space-between"}
                                >
                                    <Typography
                                        className={css.avail_count}
                                        sx={{
                                            color: "white",
                                            fontSize: "2.8rem",
                                            fontWeight: "bold",
                                        }}
                                        my={1}
                                    >
                                        {count || "0"}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        className={css.avail_txt}
                                        my={1}
                                        sx={{
                                            color: "white",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {title}{" "}
                                        <Typography
                                            variant="caption"
                                            className={css.avail_job_txt}
                                            my={1}
                                            sx={{
                                                color: "white",
                                                fontSize: "1.5rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {second_txt || ""}
                                        </Typography>
                                    </Typography>
                                </Stack>
                                <img
                                    src={wave_img}
                                    alt=""
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: "100%",
                                        height: "auto",
                                        opacity: 0.5,
                                    }}
                                />
                            </Stack>
                        </Grid>
                    )
                )}
            </Grid>
        </Stack>
    );
};

export default DashboardHome;
