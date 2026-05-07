import React, { useEffect, useState } from "react";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";

const ChangePasswordForm = () => {
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordLoading(true);
        setPasswordMessage("");
        setPasswordError("");

        try {
            const response = await apiHandle.post("change-password", passwordForm);

            if (response.data.success) {
                setPasswordMessage(
                    response.data.message || "Password changed successfully."
                );

                setPasswordForm({
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                });
            } else {
                setPasswordError("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Password change error:", error);

            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)?.[0]?.[0];
                setPasswordError(firstError || "Password change failed.");
            } else {
                setPasswordError(
                    error.response?.data?.message || "Password change failed."
                );
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Change Password
                </h2>

                <p className="text-gray-500 mt-1">
                    Update your account password securely.
                </p>
            </div>

            {passwordMessage && (
                <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700">
                    {passwordMessage}
                </div>
            )}

            {passwordError && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
                    {passwordError}
                </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                    </label>

                    <input
                        type="password"
                        name="current_password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="new_password"
                            value={passwordForm.new_password}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="new_password_confirmation"
                            value={passwordForm.new_password_confirmation}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg bg-[#004c78] text-white font-semibold shadow-md hover:bg-[#003556] hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {passwordLoading && (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}

                        {passwordLoading ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
};


const Profile = () => {
    const IMAGE_BASE_URL = `${process.env.REACT_APP_IMAGE_URL}/storage/`;

    const [formData, setFormData] = useState({
        photo: null,
        designation: "",
        institution: "",
        department: "",
        country: "",
        bio: "",
        research_interests: "",
        skills: "",
        personal_website_url: "",
        orcid_id: "",
        publications: "",
    });

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState(null);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const arrayToText = (value) => {
        if (!value) return "";

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        return value;
    };

    const loadProfile = async () => {
        setPageLoading(true);
        setMessage("");
        setErrorMessage("");

        try {
            const response = await apiHandle.get("get-profile");

            if (response.data.success) {
                const user = response.data.user;
                const profile = response.data.profile;

                setUserInfo({
                    name: user?.name || "",
                    email: user?.email || "",
                });

                if (profile) {
                    setFormData({
                        photo: null,
                        designation: profile.designation || "",
                        institution: profile.institution || "",
                        department: profile.department || "",
                        country: profile.country || "",
                        bio: profile.bio || "",
                        research_interests: arrayToText(profile.research_interests),
                        skills: arrayToText(profile.skills),
                        personal_website_url: profile.personal_website_url || "",
                        orcid_id: profile.orcid_id || "",
                        publications: arrayToText(profile.publications),
                    });

                    if (profile.photo) {
                        setExistingPhoto(`${IMAGE_BASE_URL}${profile.photo}`);
                    }
                }
            }
        } catch (error) {
            console.error("Profile load error:", error);
            setErrorMessage("Failed to load profile data.");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            const file = files?.[0];

            if (!file) {
                setFormData((prev) => ({
                    ...prev,
                    photo: null,
                }));
                return;
            }

            if (!file.type.startsWith("image/")) {
                setErrorMessage("Please upload a valid image file.");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                photo: file,
            }));

            setPhotoPreview(URL.createObjectURL(file));
            setErrorMessage("");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setErrorMessage("");

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await apiHandle.post("update-profile", submitData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setMessage(response.data.message || "Profile updated successfully.");

                const updatedProfile = response.data.profile;

                if (updatedProfile?.photo) {
                    setExistingPhoto(`${IMAGE_BASE_URL}${updatedProfile.photo}`);
                    setPhotoPreview(null);
                }

                loadProfile();
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Profile update error:", error);

            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)?.[0]?.[0];
                setErrorMessage(firstError || "Validation failed.");
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Failed to update profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Update Profile
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Fill your profile information. All fields are optional.
                    </p>
                </div>

                <div className="mb-6 bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Account Info</p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {userInfo.name || "User Name"}
                    </h3>
                    <p className="text-gray-500">{userInfo.email || "User Email"}</p>
                </div>

                {message && (
                    <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700">
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo
                        </label>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : existingPhoto ? (
                                    <img
                                        src={existingPhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Photo</span>
                                )}
                            </div>

                            <input
                                type="file"
                                name="photo"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#004c78] file:text-white hover:file:bg-[#003556]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Designation
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="Researcher, Doctor, Student, Professor"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Institution
                            </label>

                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="University or Organization"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>

                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Department name"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>

                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Write a short bio about yourself"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Interests
                            </label>

                            <textarea
                                name="research_interests"
                                value={formData.research_interests}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Molecular Hydrogen, Oxidative Stress, Inflammation"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Separate multiple items with comma.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>

                            <textarea
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Clinical Research, Data Analysis, Literature Review"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Separate multiple items with comma.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Personal Website URL
                            </label>

                            <input
                                type="url"
                                name="personal_website_url"
                                value={formData.personal_website_url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ORCID ID
                            </label>

                            <input
                                type="text"
                                name="orcid_id"
                                value={formData.orcid_id}
                                onChange={handleChange}
                                placeholder="0000-0000-0000-0000"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publications
                        </label>

                        <textarea
                            name="publications"
                            value={formData.publications}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Add publication titles or links. Separate multiple publications with comma."
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004c78]/30 focus:border-[#004c78]"
                        />

                        <p className="text-xs text-gray-400 mt-1">
                            Separate multiple publications with comma.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg bg-[#004c78] text-white font-semibold shadow-md hover:bg-[#003556] hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}

                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default Profile;
